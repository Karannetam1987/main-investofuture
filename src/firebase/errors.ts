export type SecurityRuleContext = {
  path: string;
  operation: "get" | "list" | "create" | "update" | "delete";
  requestResourceData?: any;
};

export class FirestorePermissionError extends Error {
  private context: SecurityRuleContext;

  constructor(context: SecurityRuleContext) {
    const message = `Firestore Permission Error: Insufficient permissions to perform ${context.operation} on ${context.path}.`;
    super(message);
    this.name = "FirestorePermissionError";
    this.context = context;
    // This is to ensure that the error is an instance of FirestorePermissionError in development environments
    Object.setPrototypeOf(this, FirestorePermissionError.prototype);
  }

  public generateErrorJson() {
    return {
      message: this.message,
      context: {
        path: this.context.path,
        operation: this.context.operation,
        requestResourceData: this.context.requestResourceData,
      },
    };
  }
}
