import AppButton from "../../../components/ui/AppButton";
import AddIcon from "@mui/icons-material/Add";
import AppTextField from "../../../components/ui/AppTextField";
import { Tune, Search } from "@mui/icons-material";
import { InputAdornment } from "@mui/material";
import { illustrations } from "../../../constants/static/images";
import AdminProductsListCard from "../../../components/app/AdminProductsListCard";

export default function ListProductsScreen() {
  return (
    <div className='p-4 space-y-6'>
      <h2 className='text-2xl font-medium'>Product List</h2>
      <div className='flex justify-end gap-5'>
        <AppTextField
          placeholder='Search'
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position='start'>
                  <Search />
                </InputAdornment>
              ),
            },
          }}
        />

        <AppButton type='icon-button'>
          <Tune />
        </AppButton>
        <AppButton
          variant='contained'
          className='bg-primary'
          startIcon={<AddIcon />}
        >
          Add Product
        </AppButton>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
        {Array.from({ length: 10 }).map((_, index) => (
          <AdminProductsListCard
            key={index}
            brand={`Brand ${index + 1}`}
            image={illustrations.assignmentRequestEmpty}
            category={`Category ${index + 1}`}
            name={`Product ${index + 1}`}
            price={10 + index}
          />
        ))}
      </div>
    </div>
  );
}
