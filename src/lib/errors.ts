export class AppError extends Error {
  readonly code: string;
  readonly statusCode: number;
  readonly details?: unknown;

  constructor(code: string, message: string, statusCode: number, details?: unknown) {
    super(message);
    this.name = new.target.name;
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class ValidationError extends AppError {
  constructor(message = "Dados inválidos.", details?: unknown) {
    super("INVALID_REQUEST", message, 400, details);
  }
}

export class RegistrationClosedError extends AppError {
  constructor(message = "As inscrições estão encerradas.") {
    super("REGISTRATION_CLOSED", message, 409);
  }
}

export class NoSlotsAvailableError extends AppError {
  constructor(message = "Não há vagas disponíveis.") {
    super("NO_SLOTS_AVAILABLE", message, 409);
  }
}

export class BatchExpiredError extends AppError {
  constructor(message = "Não há lote de inscrição ativo no momento.") {
    super("BATCH_EXPIRED", message, 409);
  }
}

export class RegistrationNotFoundError extends AppError {
  constructor(message = "Inscrição não encontrada.") {
    super("REGISTRATION_NOT_FOUND", message, 404);
  }
}

export class PaymentNotFoundError extends AppError {
  constructor(message = "Pagamento não encontrado.") {
    super("PAYMENT_NOT_FOUND", message, 404);
  }
}

export class PaymentCreationFailedError extends AppError {
  constructor(message = "Não foi possível criar a cobrança.") {
    super("PAYMENT_CREATION_FAILED", message, 502);
  }
}

export class PaymentAlreadyPaidError extends AppError {
  constructor(message = "Esta inscrição já está paga.") {
    super("PAYMENT_ALREADY_PAID", message, 409);
  }
}

export class PaymentAmountMismatchError extends AppError {
  constructor(message = "O valor do pagamento não confere com a inscrição.") {
    super("PAYMENT_AMOUNT_MISMATCH", message, 422);
  }
}

export class DuplicatePaymentError extends AppError {
  constructor(message = "Este pagamento já está associado a outra inscrição.") {
    super("DUPLICATE_PAYMENT", message, 409);
  }
}

export class InvalidWebhookSignatureError extends AppError {
  constructor(message = "Assinatura do webhook inválida.") {
    super("INVALID_WEBHOOK_SIGNATURE", message, 401);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Autenticação necessária.") {
    super("UNAUTHORIZED", message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Acesso não autorizado.") {
    super("FORBIDDEN", message, 403);
  }
}

export class InternalError extends AppError {
  constructor(message = "Erro interno.") {
    super("INTERNAL_ERROR", message, 500);
  }
}
