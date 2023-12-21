import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta name="google-site-verification" content="SDj04fjoR3GRClP9kPd1jZJAmqPnKdnzs5NAWGcoA_s" />
          {/* ... other head tags */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;