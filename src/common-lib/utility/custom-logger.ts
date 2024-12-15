import fs from 'fs';
import path from 'path';

enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export class CustomLogger {
  private logFile: string;

  constructor() {
    this.logFile = path.join(__dirname, 'logs', 'app.log');
    this.ensureLogFileExists();
  }

  // Ensure log file directory exists
  private ensureLogFileExists() {
    const logDirectory = path.dirname(this.logFile);
    if (!fs.existsSync(logDirectory)) {
      fs.mkdirSync(logDirectory, { recursive: true });
    }
  }

  private writeLog(level: LogLevel, message: string) {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} [${level}] ${message}\n`;

    fs.appendFileSync(this.logFile, logMessage);
  }

  info(message: string) {
    this.writeLog(LogLevel.INFO, message);
  }

  error(message: string) {
    this.writeLog(LogLevel.ERROR, message);
  }
}
