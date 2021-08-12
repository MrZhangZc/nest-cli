module.exports = (line, hump, entitys) => `
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ${hump}Controller } from './${line}.controller';
import { ${hump}Service } from './${line}.service';
${`import { ${entitys.join(', ')} } from \u0027../../entities\u0027;`}

@Module({
  imports: [
    TypeOrmModule.forFeature([${entitys}]),
  ],
  controllers: [${hump}Controller],
  providers: [${hump}Service],
})
export class ${hump}Module {}
`