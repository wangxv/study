import { OnQueueActive, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor()
export class AudioProcessor {
  private readonly logger = new Logger(AudioProcessor.name);

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.debug(
      `Processing job ${job.id} of type ${job.name} width data ${job.data}...`,
    );
  }

  @Process('transcode')
  handleTranscode(job: Job) {
    this.logger.debug('start transcoding...');
    this.logger.debug(job.data);
    this.logger.debug('end transcoding...');
  }
}
