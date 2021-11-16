import { Injectable } from '@nestjs/common';

@Injectable()
export class ExceptionService {
  fetch(id): string {
    return `hello world! ${id}`;
  }
  save(message): string {
    return `set hello done! ${message}`;
  }
  update(id: string, message: string): string {
    return `update hello done! ${id}: ${message}`;
  }
  remove(id): string {
    return `${id} record was removed`;
  }
}
