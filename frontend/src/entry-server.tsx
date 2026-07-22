// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";

import { DEFAULT_LOCALE, dirFor } from "~/lib/i18n";

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang={DEFAULT_LOCALE} dir={dirFor(DEFAULT_LOCALE)}>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
          {assets}
        </head>
        <body>
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));
