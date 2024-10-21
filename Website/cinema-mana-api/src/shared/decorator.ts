import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const AttachFieldParamsToBodyDecorator = (
  param: string,
  ...dataOrPipes: unknown[]
) => {
  return createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    request.body[param] = request.params[param];
    return request.body;
  })(...dataOrPipes);
};

export const AttachEmployeeToBodyDecorator = (
  ...dataOrPipes: unknown[]
) => {
  return createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    request.body['employee'] = request['employee'];
    request.body['employeeId'] = request['employee'].id;
    return request.body;
  })(...dataOrPipes);
};
