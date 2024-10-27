import { Request, Response, NextFunction } from 'express';

export function asyncHandler(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value

  descriptor.value = function (...args: [Request, Response, NextFunction]) {
    const [req, res, next] = args
    Promise.resolve(originalMethod.apply(this, args)).catch(next)
  }

  return descriptor
}
