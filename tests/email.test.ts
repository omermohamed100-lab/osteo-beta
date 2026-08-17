import assert from 'node:assert/strict';
import test from 'node:test';
import {
  EmailConfigurationError,
  getSMTPConfiguration,
  isValidNotificationRecipient,
  sendEmail,
} from '../src/lib/email';

const smtpEnvironment = {
  SMTP_HOST: 'smtp.egsom.test',
  SMTP_PORT: '587',
  SMTP_USER: 'mailer',
  SMTP_PASS: 'test-only-password',
  SMTP_FROM: 'EGSOM Website <website@egsom.org>',
  SMTP_SECURE: 'false',
};

const originalValues = Object.fromEntries(
  Object.keys(smtpEnvironment).map((name) => [name, process.env[name]]),
);

test.afterEach(() => {
  for (const [name, value] of Object.entries(originalValues)) {
    if (value === undefined) delete process.env[name];
    else process.env[name] = value;
  }
});

function configureSMTP() {
  Object.assign(process.env, smtpEnvironment);
}

test('requires complete SMTP configuration with authenticated TLS and timeouts', () => {
  const configuration = getSMTPConfiguration(smtpEnvironment);

  assert.equal(configuration.host, 'smtp.egsom.test');
  assert.equal(configuration.port, 587);
  assert.equal(configuration.secure, false);
  assert.equal(configuration.requireTLS, true);
  assert.equal(configuration.tls.rejectUnauthorized, true);
  assert.equal(configuration.tls.minVersion, 'TLSv1.2');
  assert.equal(configuration.connectionTimeout, 10_000);
  assert.equal(configuration.socketTimeout, 15_000);
});

test('rejects missing, malformed, and header-injected SMTP settings', () => {
  assert.throws(() => getSMTPConfiguration({}), EmailConfigurationError);
  assert.throws(
    () => getSMTPConfiguration({ ...smtpEnvironment, SMTP_PORT: 'invalid' }),
    EmailConfigurationError,
  );
  assert.throws(
    () => getSMTPConfiguration({ ...smtpEnvironment, SMTP_HOST: 'smtp.test\r\nInjected: yes' }),
    EmailConfigurationError,
  );
});

test('rejects placeholder and malformed notification recipients', () => {
  assert.equal(isValidNotificationRecipient('office@egsom.org'), true);
  assert.equal(isValidNotificationRecipient('no-reply@example.com'), false);
  assert.equal(isValidNotificationRecipient('person@example.test'), false);
  assert.equal(isValidNotificationRecipient('invalid'), false);
});

test('sends through the configured transport without exposing transport details', async () => {
  configureSMTP();
  const sentMessages: Array<{ from: string; to: string }> = [];
  const result = await sendEmail(
    {
      to: 'office@egsom.org',
      subject: 'New website contact submission',
      text: 'Test notification',
    },
    () => ({
      async sendMail(message) {
        sentMessages.push({ from: message.from, to: message.to });
        return { messageId: 'provider-id' };
      },
    }),
  );

  assert.deepEqual(result, { success: true });
  assert.equal(sentMessages[0]?.to, 'office@egsom.org');
  assert.equal(sentMessages[0]?.from, smtpEnvironment.SMTP_FROM);
});

test('returns safe configuration and transport failure categories', async () => {
  delete process.env.SMTP_HOST;
  const missing = await sendEmail({
    to: 'office@egsom.org',
    subject: 'Contact notification',
    text: 'Test',
  });

  configureSMTP();
  const failed = await sendEmail(
    { to: 'office@egsom.org', subject: 'Contact notification', text: 'Test' },
    () => ({
      async sendMail() {
        throw new Error('provider credentials must not escape');
      },
    }),
  );

  assert.deepEqual(missing, { success: false, reason: 'configuration' });
  assert.deepEqual(failed, { success: false, reason: 'transport' });
});
