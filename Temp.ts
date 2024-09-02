export interface RetryOptions {
  retries: number;
  delay: number;
  retryCondition?: (error: any, attempt: number) => boolean;
}

export async function retryRequest(
  requestFn: () => Promise<Response>,
  { retries, delay, retryCondition }: RetryOptions
): Promise<Response> {
  let lastError: any;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await requestFn();
    } catch (err) {
      lastError = err;

      // Check if this was the last attempt or if a custom retry condition is provided and fails
      if (attempt === retries || (retryCondition && !retryCondition(err, attempt))) {
        throw lastError;
      }

      // Log retry attempt (optional)
      console.log(`Retry attempt ${attempt + 1} failed: ${err.message}`);

      // Exponential backoff logic
      await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, attempt)));
    }
  }

  // This line should never be reached, but is here to satisfy TypeScript's strict return checks.
  throw new Error('Unexpected error in retry logic');
}