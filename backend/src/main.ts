// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilita o CORS para o Front-end conseguir conversar com o Back-end
  app.enableCors(); 
  
  await app.listen(3001); // Garanta que o Back está na 3001 e o Front na 3000

  console.log(`🚀 Back-end rodando em: http://localhost:3001`);
}
bootstrap();