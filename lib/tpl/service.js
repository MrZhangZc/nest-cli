module.exports = (line, hump, entitys, shump) => 
`import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
${`import { ${entitys.join(', ')} } from \u0027../../entities\u0027;`}

@Injectable()
export class ${hump}Service {
  ${entitys.map((item) => {
  return `
  @InjectRepository(${item})
  private readonly ${item}Rep!: Repository<${item}>;`
  }).join('\t\t\n')}

  public async create(body) {
    await this.${entitys[0]}Rep.save(body);
  }

  public async find(start, length, id, name) {
    const where = {}
    if (id) Object.assign(where, { id });
    if (name) Object.assign(where, { name });

    const list = await this.${entitys[0]}Rep.findAndCount({
      where,
      order: {
        id: 'DESC',
      },
      skip: start,
      take: length,
    });
    return {
      list: list[0],
      total: list[1],
    };
  }

  public async updateById(id, body) {
    return await this.${entitys[0]}Rep.update({ id }, body);
  }

  public async deleteById(id) {
    return this.${entitys[0]}Rep.delete({ id });
  }
}
`