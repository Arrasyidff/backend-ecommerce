// scripts/generate-module.js
const fs = require('fs');
const path = require('path');

// Ambil nama modul dari command line argument
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Mohon berikan nama modul, contoh: node generate-module.js product');
  process.exit(1);
}

const moduleName = args[0].toLowerCase();
const ModuleName = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
const baseDir = path.join(__dirname, '../src/api', moduleName + 's');

// Buat direktori jika belum ada
if (!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir, { recursive: true });
}

// Template files
const modelTemplate = `// src/api/${moduleName}s/${moduleName}.model.ts
export interface ${ModuleName}Dto {
  id?: string;
  name: string;
  description?: string;
  // Tambahkan properti lain sesuai kebutuhan
}
`;

const validationTemplate = `// src/api/${moduleName}s/${moduleName}.validation.ts
import Joi from 'joi';

export const create${ModuleName}Schema = Joi.object({
  name: Joi.string().required().min(2).max(100),
  description: Joi.string().allow('', null),
  // Tambahkan validasi lain sesuai kebutuhan
});

export const update${ModuleName}Schema = Joi.object({
  name: Joi.string().min(2).max(100),
  description: Joi.string().allow('', null),
  // Tambahkan validasi lain sesuai kebutuhan
}).min(1);
`;

const serviceTemplate = `// src/api/${moduleName}s/${moduleName}.service.ts
import { prisma } from '../../config/database';
import { DatabaseError } from '../../utils/errors/database-error';
import { ApiError } from '../../utils/errors/api-error';
import { ${ModuleName}Dto } from './${moduleName}.model';

export class ${ModuleName}Service {
  public async getAll${ModuleName}s() {
    try {
      const ${moduleName}s = await prisma.${moduleName}.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      return ${moduleName}s;
    } catch (error) {
      throw new DatabaseError('Failed to fetch ${moduleName}s');
    }
  }

  public async get${ModuleName}ById(id: string) {
    try {
      const ${moduleName} = await prisma.${moduleName}.findUnique({
        where: { id }
      });
      
      if (!${moduleName}) {
        throw new ApiError(404, '${ModuleName} not found');
      }
      
      return ${moduleName};
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new DatabaseError('Failed to fetch ${moduleName}');
    }
  }

  public async create${ModuleName}(${moduleName}Data: ${ModuleName}Dto) {
    try {
      const new${ModuleName} = await prisma.${moduleName}.create({
        data: ${moduleName}Data
      });
      
      return new${ModuleName};
    } catch (error) {
      throw new DatabaseError('Failed to create ${moduleName}');
    }
  }

  public async update${ModuleName}(id: string, ${moduleName}Data: Partial<${ModuleName}Dto>) {
    try {
      // Check if ${moduleName} exists
      const existing${ModuleName} = await prisma.${moduleName}.findUnique({
        where: { id }
      });
      
      if (!existing${ModuleName}) {
        throw new ApiError(404, '${ModuleName} not found');
      }
      
      const updated${ModuleName} = await prisma.${moduleName}.update({
        where: { id },
        data: ${moduleName}Data
      });
      
      return updated${ModuleName};
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new DatabaseError('Failed to update ${moduleName}');
    }
  }

  public async delete${ModuleName}(id: string) {
    try {
      // Check if ${moduleName} exists
      const existing${ModuleName} = await prisma.${moduleName}.findUnique({
        where: { id }
      });
      
      if (!existing${ModuleName}) {
        throw new ApiError(404, '${ModuleName} not found');
      }
      
      await prisma.${moduleName}.delete({
        where: { id }
      });
      
      return { success: true };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new DatabaseError('Failed to delete ${moduleName}');
    }
  }
}
`;

const controllerTemplate = `// src/api/${moduleName}s/${moduleName}.controller.ts
import { Request, Response, NextFunction } from 'express';
import { ${ModuleName}Service } from './${moduleName}.service';
import { ${ModuleName}Dto } from './${moduleName}.model';

export class ${ModuleName}Controller {
  private ${moduleName}Service: ${ModuleName}Service;
  
  constructor() {
    this.${moduleName}Service = new ${ModuleName}Service();
  }
  
  public getAll${ModuleName}s = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ${moduleName}s = await this.${moduleName}Service.getAll${ModuleName}s();
      
      res.status(200).json({
        status: 'success',
        data: { ${moduleName}s }
      });
    } catch (error) {
      next(error);
    }
  };
  
  public get${ModuleName}ById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const ${moduleName} = await this.${moduleName}Service.get${ModuleName}ById(id);
      
      res.status(200).json({
        status: 'success',
        data: { ${moduleName} }
      });
    } catch (error) {
      next(error);
    }
  };
  
  public create${ModuleName} = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ${moduleName}Data: ${ModuleName}Dto = req.body;
      const new${ModuleName} = await this.${moduleName}Service.create${ModuleName}(${moduleName}Data);
      
      res.status(201).json({
        status: 'success',
        data: { ${moduleName}: new${ModuleName} }
      });
    } catch (error) {
      next(error);
    }
  };
  
  public update${ModuleName} = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const ${moduleName}Data: Partial<${ModuleName}Dto> = req.body;
      const updated${ModuleName} = await this.${moduleName}Service.update${ModuleName}(id, ${moduleName}Data);
      
      res.status(200).json({
        status: 'success',
        data: { ${moduleName}: updated${ModuleName} }
      });
    } catch (error) {
      next(error);
    }
  };
  
  public delete${ModuleName} = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.${moduleName}Service.delete${ModuleName}(id);
      
      res.status(200).json({
        status: 'success',
        message: '${ModuleName} deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  };
}
`;

const routesTemplate = `// src/api/${moduleName}s/${moduleName}.routes.ts
import { Router } from 'express';
import { ${ModuleName}Controller } from './${moduleName}.controller';
import { AuthMiddleware } from '../auth/auth.middleware';
import { validationMiddleware } from '../../middleware/validation.middleware';
import { create${ModuleName}Schema, update${ModuleName}Schema } from './${moduleName}.validation';

const router = Router();
const ${moduleName}Controller = new ${ModuleName}Controller();
const authMiddleware = new AuthMiddleware();

// Public routes
router.get('/', ${moduleName}Controller.getAll${ModuleName}s);
router.get('/:id', ${moduleName}Controller.get${ModuleName}ById);

// Protected routes (admin only)
router.post(
  '/',
  authMiddleware.authenticate,
  authMiddleware.authorize(['ADMIN']),
  validationMiddleware(create${ModuleName}Schema),
  ${moduleName}Controller.create${ModuleName}
);

router.put(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorize(['ADMIN']),
  validationMiddleware(update${ModuleName}Schema),
  ${moduleName}Controller.update${ModuleName}
);

router.delete(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorize(['ADMIN']),
  ${moduleName}Controller.delete${ModuleName}
);

export default router;
`;

// Tulis semua file ke direktori
fs.writeFileSync(path.join(baseDir, `${moduleName}.model.ts`), modelTemplate);
fs.writeFileSync(path.join(baseDir, `${moduleName}.validation.ts`), validationTemplate);
fs.writeFileSync(path.join(baseDir, `${moduleName}.service.ts`), serviceTemplate);
fs.writeFileSync(path.join(baseDir, `${moduleName}.controller.ts`), controllerTemplate);
fs.writeFileSync(path.join(baseDir, `${moduleName}.routes.ts`), routesTemplate);

console.log(`Modul ${ModuleName} berhasil dibuat di: ${baseDir}`);
console.log('File yang dibuat:');
console.log(`- ${moduleName}.model.ts`);
console.log(`- ${moduleName}.validation.ts`);
console.log(`- ${moduleName}.service.ts`);
console.log(`- ${moduleName}.controller.ts`);
console.log(`- ${moduleName}.routes.ts`);

console.log('\nJangan lupa untuk:');
console.log(`1. Menambahkan model ${ModuleName} ke schema.prisma`);
console.log(`2. Jalankan 'npx prisma migrate dev' setelah memperbarui schema`);
console.log(`3. Daftarkan routes di src/routes/index.ts:`);
console.log(`   import ${moduleName}Routes from '../api/${moduleName}s/${moduleName}.routes';`);
console.log(`   router.use('/${moduleName}s', ${moduleName}Routes);`);