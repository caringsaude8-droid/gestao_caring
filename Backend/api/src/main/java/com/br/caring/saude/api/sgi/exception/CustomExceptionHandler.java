package com.br.caring.saude.api.sgi.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.HttpMediaTypeNotSupportedException;

import java.util.List;
import java.util.stream.Collectors;

@ControllerAdvice
public class CustomExceptionHandler extends ResponseEntityExceptionHandler {

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
                                                                 HttpHeaders headers,
                                                                 HttpStatusCode status,
                                                                 WebRequest request) {
        List<String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
                .collect(Collectors.toList());

        String message = String.join("; ", errors);
        ExceptionResponse exceptionResponse = new ExceptionResponse(status.value(), message);
        return ResponseEntity.status(status).headers(headers).body(exceptionResponse);
    }

    @Override
    protected ResponseEntity<Object> handleHttpMessageNotReadable(HttpMessageNotReadableException ex,
                                                                  HttpHeaders headers,
                                                                  HttpStatusCode status,
                                                                  WebRequest request) {
        String causeMsg = ex.getMostSpecificCause() != null ? ex.getMostSpecificCause().getMessage() : ex.getMessage();
        String message = "Corpo da requisição JSON inválido: " + causeMsg;
        ExceptionResponse exceptionResponse = new ExceptionResponse(status.value(), message);
        return ResponseEntity.status(status).headers(headers).body(exceptionResponse);
    }

    @Override
    protected ResponseEntity<Object> handleHttpMediaTypeNotSupported(HttpMediaTypeNotSupportedException ex,
                                                                     HttpHeaders headers,
                                                                     HttpStatusCode status,
                                                                     WebRequest request) {
        String unsupported = ex.getContentType() != null ? ex.getContentType().toString() : "null";
        String supported = ex.getSupportedMediaTypes().stream().map(Object::toString).collect(Collectors.joining(", "));
        String message = String.format("Content-Type '%s' não suportado. Supported: %s", unsupported, supported);
        ExceptionResponse exceptionResponse = new ExceptionResponse(status.value(), message);
        return ResponseEntity.status(status).headers(headers).body(exceptionResponse);
    }

    @ExceptionHandler(ResponseStatusException.class)
    public final ResponseEntity<ExceptionResponse> handleResponseStatusException(ResponseStatusException ex) {
        int statusCode = ex.getStatusCode().value();
        String reason = ex.getReason() != null ? ex.getReason() : ex.getMessage();
        ExceptionResponse exceptionResponse = new ExceptionResponse(statusCode, reason);
        return new ResponseEntity<>(exceptionResponse, ex.getStatusCode());
    }

    @ExceptionHandler(Exception.class)
    public final ResponseEntity<ExceptionResponse> handleAllExceptions(Exception ex) {
        ExceptionResponse exceptionResponse = new ExceptionResponse(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                ex.getMessage()
        );
        return new ResponseEntity<>(exceptionResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    public static class ExceptionResponse {
        private int status;
        private String message;

        public ExceptionResponse(int status, String message) {
            this.status = status;
            this.message = message;
        }

        // Getters e Setters
        public int getStatus() { return status; }
        public void setStatus(int status) { this.status = status; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}
