import nodemailer from 'nodemailer';

const SMTP_TIMEOUT_MS = 10_000;

export type SMTPConfiguration = {
  host: string;
  port: number;
  secure: boolean;
  requireTLS: boolean;
  auth: { user: string; pass: string };
  connectionTimeout: number;
  greetingTimeout: number;
  socketTimeout: number;
  tls: { rejectUnauthorized: true; minVersion: 'TLSv1.2' };
};

export class EmailConfigurationError extends Error {
  constructor(message = 'SMTP configuration is missing or invalid.') {
    super(message);
    this.name = 'EmailConfigurationError';
  }
}

type SMTPEnvironment = Readonly<Record<string, string | undefined>>;

function requiredValue(environment: SMTPEnvironment, name: string) {
  const value = environment[name]?.trim();
  if (!value || /[\r\n]/.test(value)) throw new EmailConfigurationError();
  return value;
}

export function getSMTPConfiguration(
  environment: SMTPEnvironment = process.env,
): SMTPConfiguration & { from: string } {
  const host = requiredValue(environment, 'SMTP_HOST');
  const user = requiredValue(environment, 'SMTP_USER');
  const pass = requiredValue(environment, 'SMTP_PASS');
  const from = requiredValue(environment, 'SMTP_FROM');
  const fromMailbox = from.match(/<([^<>]+)>\s*$/)?.[1] ?? from;
  if (!isValidNotificationRecipient(fromMailbox)) {
    throw new EmailConfigurationError();
  }
  const port = Number(requiredValue(environment, 'SMTP_PORT'));
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new EmailConfigurationError();
  }

  const secureValue = environment.SMTP_SECURE?.trim().toLowerCase();
  if (secureValue && secureValue !== 'true' && secureValue !== 'false') {
    throw new EmailConfigurationError();
  }
  const secure = secureValue ? secureValue === 'true' : port === 465;

  return {
    host,
    port,
    secure,
    requireTLS: !secure,
    auth: { user, pass },
    connectionTimeout: SMTP_TIMEOUT_MS,
    greetingTimeout: SMTP_TIMEOUT_MS,
    socketTimeout: 15_000,
    tls: { rejectUnauthorized: true, minVersion: 'TLSv1.2' },
    from,
  };
}

export function isValidNotificationRecipient(value: string | null | undefined) {
  if (!value || /[\r\n]/.test(value)) return false;
  const normalized = value.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) return false;
  const domain = normalized.split('@')[1];
  return !(
    domain === 'example.com'
    || domain === 'example.org'
    || domain === 'example.net'
    || domain?.endsWith('.test')
    || domain?.endsWith('.invalid')
    || domain === 'localhost'
  );
}

type EmailInput = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

type MailTransport = {
  sendMail: (message: {
    from: string;
    to: string;
    subject: string;
    text: string;
    html?: string;
  }) => Promise<{ messageId?: string }>;
};

type TransportFactory = (configuration: SMTPConfiguration) => MailTransport;

export type EmailDeliveryResult =
  | { success: true }
  | { success: false; reason: 'configuration' | 'transport' };

export async function sendEmail(
  input: EmailInput,
  createTransport: TransportFactory = (configuration) => nodemailer.createTransport(configuration),
): Promise<EmailDeliveryResult> {
  if (!isValidNotificationRecipient(input.to) || /[\r\n]/.test(input.subject)) {
    return { success: false, reason: 'configuration' };
  }

  let configuration: SMTPConfiguration & { from: string };
  try {
    configuration = getSMTPConfiguration();
  } catch {
    return { success: false, reason: 'configuration' };
  }

  try {
    const { from, ...transportConfiguration } = configuration;
    const transport = createTransport(transportConfiguration);
    await transport.sendMail({ from, ...input });
    return { success: true };
  } catch {
    return { success: false, reason: 'transport' };
  }
}
