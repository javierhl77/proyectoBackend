

//const Userfactory = require("../dao/userFactory");
//const userService = new Userfactory();

const UserModel = require("../models/user.model.js");
const CartModel = require("../models/cart.model.js");

const { createHash, isValidPassword } = require("../utils/hashbcrypt.js");

class UserRepository {



    async getUsers({ limit = 10, page = 1, sort, query } = {} ) {

        try {
            const skip = (page - 1) * limit;
    
            let queryOptions = {};
    
            if (query) {
                queryOptions = { category: query };
            }
    
            const sortOptions = {};
            if (sort) {
                if (sort === 'asc' || sort === 'desc') {
                    sortOptions.price = sort === 'asc' ? 1 : -1;
                }
            }
    
            const usuarios = await UserModel
            .find(queryOptions)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit);
    
        const totalUsuarios = await UserModel.countDocuments(queryOptions);
    
        const totalPages = Math.ceil(totalUsuarios / limit);
                const hasPrevPage = page > 1;
                const hasNextPage = page < totalPages;
    
                return {
                    docs: usuarios,
                    totalPages,
                    prevPage: hasPrevPage ? page - 1 : null,
                    nextPage: hasNextPage ? page + 1 : null,
                    page,
                    hasPrevPage,
                    hasNextPage,
                    prevLink: hasPrevPage ? `/api/users?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
                    nextLink: hasNextPage ? `/api/users?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
                };
    
    
    
            
        } catch (error) {
            console.log("Error al obtener los usuarios", error);
            throw error;
        }
          
    
    
        }


/*     async findByEmail({email}) {
        try {
            const usuario = await UserModel.findOne({email});
            return usuario;
        } catch (error) {
            throw new  error("error")
        }
    }
 */
    
}

module.exports = UserRepository;