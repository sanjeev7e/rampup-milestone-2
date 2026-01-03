import { useState } from "react";
import AppButton from "../../../components/ui/AppButton";
import AddIcon from "@mui/icons-material/Add";
import AppTextField from "../../../components/ui/AppTextField";
import { Tune, Search } from "@mui/icons-material";
import { InputAdornment, CircularProgress } from "@mui/material";
import { icons, illustrations } from "../../../constants/static/images";
import AdminProductsListCard from "../../../components/app/AdminProductsListCard";
import { useNavigate } from "react-router-dom";
import { useProducts, useDeleteProduct } from "../../../hooks/useProducts";
import AppAlertDialog from "../../../components/ui/AppAlertDialog";
import { useDebounce } from "../../../hooks/useDebounce";

export default function ListProductsScreen() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );

  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct({
    onSuccess: () => {
      setDeleteDialogOpen(false);
      setSelectedProductId(null);
    },
  });

  const handleDeleteClick = (id: string) => {
    setSelectedProductId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedProductId) {
      deleteProduct(selectedProductId);
    }
  };

  // Fetch products with search filter
  const { data, isLoading, error } = useProducts({
    search: debouncedSearchQuery || undefined,
  });

  const products = data?.products ?? [];

  return (
    <div className='p-4 space-y-6 w-full bg-schemes-surface'>
      <h2 className='text-2xl font-medium'>Product List</h2>
      <div className='flex justify-end items-center gap-5'>
        <AppTextField
          placeholder='Search'
          value={searchQuery}
          inputProps={{
            className: "py-0! h-11!",
          }}
          onChange={(e) => setSearchQuery(e.target.value)}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position='start'>
                  <Search />
                </InputAdornment>
              ),
            },
          }}
          className='w-80 h-11 rounded-xl!'
        />

        <AppButton
          className='bg-inverse-on-surface! w-11 h-11  rounded-lg!'
          type='icon-button'
        >
          <Tune />
        </AppButton>
        <AppButton
          variant='contained'
          className='bg-primary w-36 h-11 rounded-xl!'
          startIcon={<AddIcon />}
          onClick={() => navigate("/admin/products/add")}
        >
          Add Product
        </AppButton>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className='flex justify-center items-center py-20'>
          <CircularProgress />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className='flex flex-col items-center gap-4 py-10'>
          <p className='text-error text-lg'>Failed to load products</p>
          <p className='text-on-surface-variant'>{error.message}</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && products.length === 0 && (
        <div className='flex flex-col items-center gap-10'>
          <img src={illustrations.productsEmpty} alt='' />
          <div className='text-center space-y-5 mx-20'>
            <h3 className='font-medium text-3xl'>
              Upload Products to Kickstart and Streamline Your Business
              Operations
            </h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
          <AppButton
            variant='contained'
            startIcon={<AddIcon />}
            className='py-4! px-32!'
            onClick={() => navigate("/admin/products/add")}
          >
            Add Product
          </AppButton>
        </div>
      )}

      {/* Products Grid */}
      {!isLoading && !error && products.length > 0 && (
        <div className='grid grid-cols-5 gap-4'>
          {products.map((product) => (
            <AdminProductsListCard
              key={product.id}
              image={product.productImage}
              category={product.productCategory}
              name={product.productName}
              price={product.marketSellingPrice}
              onClick={() => navigate(`/admin/products/view/${product.id}`)}
              onEdit={() => navigate(`/admin/products/edit/${product.id}`)}
              onDelete={() => handleDeleteClick(product.id)}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AppAlertDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        title={
          <>
            <img src={icons.info} alt='' />
            <h5 className='text-base font-medium'>Attention !</h5>
          </>
        }
        content={
          <p className='text-sm text-on-surface-variant'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam
          </p>
        }
        actions={[
          <>
            <AppButton
              variant='outlined'
              className='rounded-lg! py-4! px-14!'
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </AppButton>
            <AppButton
              variant='contained'
              className='rounded-lg! py-4! px-14! bg-error!'
              onClick={handleConfirmDelete}
              loading={isDeleting}
              autoFocus
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AppButton>
          </>,
        ]}
      />
    </div>
  );
}
