using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace StudentsManagementApi.Data
{
    public class StudentDbContextFactory
        : IDesignTimeDbContextFactory<StudentDbContext>
    {
        public StudentDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<StudentDbContext>();

            optionsBuilder.UseSqlServer(
                "Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=StudentManagementDb;Integrated Security=True;"
            );

            return new StudentDbContext(optionsBuilder.Options);
        }
    }
}
