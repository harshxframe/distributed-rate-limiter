export const attachHeader = (res, result, identifier) =>{
    res.setHeader('X-RateLimit-Limit', result.limit);
    res.setHeader('X-RateLimit-Remaining', result.remaining);
    res.setHeader('Retry-After', result.retryAfter);
    res.setHeader("X-RateLimit-Policy", identifier);
}




