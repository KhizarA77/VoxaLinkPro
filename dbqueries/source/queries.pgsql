CREATE TYPE OAuthProvider AS ENUM ('Google', 'Apple', 'Microsoft');
CREATE TYPE SubscriptionType AS ENUM ('free', 'monthly', 'token');

CREATE TABLE USERS (
    USERID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    EMAIL VARCHAR(255) UNIQUE NOT NULL,
    OAUTHPROVIDER OAuthProvider NOT NULL,
    SUBSCRIPTIONTYPE SubscriptionType NOT NULL default 'free',
    WALLETADDRESSES TEXT[] CHECK (array_length(walletAddresses, 1) <= 3),
    VOICEBIOMETRICPATHS TEXT[] CHECK (array_length(voiceBiometricPaths, 1) <= 3), 
    SUBSCRIPTIONENDDATE DATE,
    LASTUSE TIMESTAMP,
    DAILYUSAGE INTEGER DEFAULT 0 --reset 24 hours after last use
);

DROP TABLE USERS;

SELECT * FROM USERS;
