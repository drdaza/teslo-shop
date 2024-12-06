import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const GetRawRequestHeaders = createParamDecorator((header: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    let returnStatement = null;

    if (header) {
        returnStatement = request.headers[header];
    } else {
        returnStatement = request.headers;
    }
    return returnStatement;
});