import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RolesGuard } from './roles.guard'

@Module({
  imports: [TypeOrmModule.forFeature([])],
  providers: [RolesGuard],
  exports: [RolesGuard]
})
export class RolesModule {}
