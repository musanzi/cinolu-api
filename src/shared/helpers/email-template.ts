import { convert } from 'html-to-text';

type EmailAction = {
  label: string;
  url: string;
};

type EmailTemplateOptions = {
  title: string;
  greetingName: string;
  intro: string;
  body?: string[];
  action?: EmailAction;
  highlight?: {
    label: string;
    value: string;
  };
  note?: string;
};

type EmailContent = {
  html: string;
  text: string;
};

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const paragraph = (value: string): string => `<p>${escapeHtml(value)}</p>`;

export const buildEmailBody = (options: EmailTemplateOptions): EmailContent => {
  const action = options.action
    ? `<p>
        <a href="${escapeHtml(options.action.url)}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;font-weight:700;padding:12px 18px;border-radius:6px;">${escapeHtml(options.action.label)}</a>
      </p>
      <p>Si le lien ne fonctionne pas, copiez cette adresse dans votre navigateur :</p>
      <p><a href="${escapeHtml(options.action.url)}"><u>${escapeHtml(options.action.url)}</u></a></p>`
    : '';

  const highlight = options.highlight
    ? `<div>
        <p><strong><u>${escapeHtml(options.highlight.label)}</u></strong></p>
        <p><strong>${escapeHtml(options.highlight.value)}</strong></p>
      </div>`
    : '';

  const note = options.note ? `<p>${escapeHtml(options.note)}</p>` : '';

  const html = `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>${escapeHtml(options.title)}</title>
  </head>
  <body>
    ${paragraph(`Bonjour ${options.greetingName},`)}

    ${paragraph(options.intro)}

    ${(options.body ?? []).map(paragraph).join('\n\n    ')}

    ${action}

    ${highlight}

    ${note}

    <p>L'équipe Starter</p>G
  </body>
</html>`;

  return {
    html,
    text: convert(html, {
      wordwrap: 120,
      selectors: [
        { selector: 'a', options: { hideLinkHrefIfSameAsText: true } },
        { selector: 'img', format: 'skip' }
      ]
    })
  };
};
