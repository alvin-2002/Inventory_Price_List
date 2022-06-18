using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;

namespace API.Extensions
{
    public static class ProductExtension
    {
        public static IQueryable<Product> Search(this IQueryable<Product> query, string searchTerm)
        {
            if (string.IsNullOrEmpty(searchTerm)) return query;

            var lowerCaseSearch = searchTerm.Trim().ToLower();

            return query.Where(p => p.Name.ToLower().Contains(lowerCaseSearch));
        }

        public static IQueryable<Product> Filter(this IQueryable<Product> query, int? categoryId, int? shopId)
        {
            if (categoryId > 0 && categoryId != null) query = query.Where(p => p.CategoryId == categoryId);
            if (shopId > 0 && shopId != null) query = query.Where(p => p.ShopId == shopId);

            return query;
        }
    }
}