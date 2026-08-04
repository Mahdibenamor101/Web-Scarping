// Shared wrapper for every outbound email (verification, staff invite):
// a small branded header echoing the site's wordmark logo (CONTEXT.md
// §12.36 -- serif, gold, no icon) so recipients see the same identity as
// the web app. Custom web fonts (Playfair Display) aren't reliably
// supported across email clients, so this falls back to a generic serif
// stack rather than loading a font -- Georgia is the closest common
// system serif to Playfair Display's proportions.
export function wrapEmailHtml(bodyHtml: string): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #1E2A26;">
      <div style="font-family: Georgia, 'Times New Roman', serif; font-size: 26px; font-weight: 400; letter-spacing: 0.5px; color: #A9841C;">
        Tavolino
      </div>
      <div style="height: 1px; background: #E5DFD0; margin: 16px 0 24px;"></div>
      <div style="font-size: 14px; line-height: 1.6;">
        ${bodyHtml}
      </div>
    </div>
  `;
}
