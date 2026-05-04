/**
 * ERC-8021: Transaction Attribution
 * This allows builder identification in on-chain transactions.
 */

export const BUILDER_CODE = "bc_cy38d3l1"; // From user prompt
export const ATTRIBUTION_CODE = "SnakeBomber";

/**
 * Formats attribution data for a transaction calldata string.
 * This is a basic implementation to be attached to calldata if the contract supports it.
 */
export function getAttributionData() {
  return `${ATTRIBUTION_CODE}:${BUILDER_CODE}`;
}

export function generateAttributedTransaction(baseCalldata: string) {
  // In a real ERC-8021 implementation, this might encode the builder code
  // into the transaction data or emit it in a specific parameter.
  // For now, we return a structured object that standard Wagmi hooks can use if adapted.
  return {
    data: baseCalldata,
    // Add additional fields or modify the data string according to the spec.
    attribution: getAttributionData()
  }
}
