import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    // Conectando ao Atlas (substitua pelo seu link completo com a senha se for diferente)
    MongooseModule.forRoot('mongodb+srv://admin:migabouqbybu12dby8bdyu8bwefybcuiqwy83g789171@cluster0.lxjegig.mongodb.net/BackendCC?retryWrites=true&w=majority'),
    UsersModule,
  ],
})
export class AppModule {}