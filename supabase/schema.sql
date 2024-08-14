CREATE TABLE Recipe (
    id TEXT NOT NULL, 
    name TEXT NOT NULL, 
    creator TEXT NOT NULL, 
    created TIMESTAMPTZ NOT NULL,
    description TEXT, 
    keywords TEXT[],
    queries JSONB NOT NULL, 
    processor TEXT NOT NULL, 
    schema TEXT NOT NULL, 
    resolver TEXT NOT NULL, 
    revokable BOOLEAN NOT NULL, 
    publish_state TEXT NOT NULL, 
    PRIMARY KEY (id)
);

CREATE TABLE Run (
    id TEXT NOT NULL,
    recipe_id TEXT NOT NULL,
    creator TEXT NOT NULL, 
    created TIMESTAMPTZ NOT NULL,
    chain_id BIGINT NOT NULL,
    gas TEXT, 
    base_fee_per_gas TEXT, 
    max_priority_fee_per_gas TEXT,
    user_fee TEXT, 
    payment_transaction_hash TEXT, 
    payment_block_number TEXT, 
    payment_log_index TEXT, 
    attestation_transaction_hash TEXT, 
    attestation_uid TEXT, 
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

CREATE OR REPLACE FUNCTION list_popular_recipes(
  page INTEGER,
  pageSize INTEGER
)
RETURNS TABLE (
  id TEXT,
  name TEXT,
  description TEXT,
  creator TEXT,
  created TIMESTAMPTZ,
  nr_of_runs INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    r.id,
    r.name,
    r.description,
    r.creator,
    r.created,
    COUNT(run.id)::INTEGER AS nr_of_runs
  FROM
    Recipe r
  LEFT JOIN
    Run run ON r.id = run.recipe_id
  GROUP BY
    r.id
  ORDER BY
    nr_of_runs DESC
  LIMIT pageSize
  OFFSET (page - 1) * pageSize;
END;
$$ LANGUAGE plpgsql;