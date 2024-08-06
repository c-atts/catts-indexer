CREATE TABLE Recipe (
    id BYTEA NOT NULL, 
    name TEXT NOT NULL, 
    display_name TEXT, 
    creator BYTEA NOT NULL, 
    created TIMESTAMP NOT NULL,
    description TEXT, 
    keywords TEXT[],
    queries JSONB NOT NULL, 
    processor TEXT NOT NULL, 
    schema TEXT NOT NULL, 
    resolver BYTEA NOT NULL, 
    revokable BOOLEAN NOT NULL, 
    publish_state TEXT NOT NULL, 
    PRIMARY KEY (id)
);

CREATE TABLE Run (
    id BYTEA NOT NULL,
    recipe_id BYTEA NOT NULL,
    creator BYTEA NOT NULL, 
    created TIMESTAMP NOT NULL,
    chain_id BIGINT NOT NULL,
    gas BYTEA, 
    base_fee_per_gas BYTEA, 
    max_priority_fee_per_gas BYTEA,
    user_fee BYTEA, 
    payment_transaction_hash BYTEA, 
    payment_block_number BYTEA, 
    payment_log_index BYTEA, 
    attestation_transaction_hash BYTEA, 
    attestation_uid BYTEA, 
    is_cancelled BOOLEAN NOT NULL, 
    error TEXT, 
    PRIMARY KEY (id),
    CONSTRAINT fk_recipe
      FOREIGN KEY(recipe_id) 
	  REFERENCES Recipe(id)
);

CREATE TABLE change_log_tracker (
    id SERIAL PRIMARY KEY,
    latest_change_log_id BIGINT,
    last_updated TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO change_log_tracker (latest_change_log_id) VALUES (NULL);