import { useState } from 'react';
import { useAuthViewModel } from '@hooks/use-auth.hook';
import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { IProduct } from 'src/interfaces/product.interface';
import { UserModel } from 'src/models/user.model';

type Filter = 'Todos' | 'Ativos' | 'Inativos';

/* eslint-disable no-unused-vars*/
export interface MyAdsViewModel {
  user: UserModel;
  products: IProduct[];
  filter: Filter;
  filterIsOpened: boolean;
  handleOpenCreateAd: () => void;
  productsUpdate: () => void;
  handleFilterIsOpened: (value: boolean) => void;
  handleFilter: (filter: Filter) => void;
}
/* eslint-disable no-unused-vars*/

function useMyAdsViewModel(): MyAdsViewModel {
  const { navigate } = useNavigation<AppNavigatorRoutesProps>();
  const { user } = useAuthViewModel();
  const [filter, setFilter] = useState<Filter>('Todos');
  const [filterIsOpened, setFilterIsOpened] = useState(false);
  const [products, setProducts] = useState<IProduct[]>([] as IProduct[]);

  function handleOpenCreateAd() {
    navigate('createAd');
  }

  function productsUpdate() {
    if (filter === 'Todos') {
      setProducts(user.products as IProduct[]);
    }
    if (filter === 'Ativos') {
      setProducts(
        user.products.filter(
          (product) => product.is_active === true
        ) as IProduct[]
      );
    }
    if (filter === 'Inativos') {
      setProducts(
        user.products.filter(
          (product) => product.is_active === false
        ) as IProduct[]
      );
    }
  }

  function handleFilterIsOpened(value: boolean) {
    setFilterIsOpened(value);
  }

  function handleFilter(filter: Filter) {
    setFilter(filter);
  }

  return {
    user,
    products,
    filter,
    filterIsOpened,
    productsUpdate,
    handleOpenCreateAd,
    handleFilterIsOpened,
    handleFilter,
  };
}

export { useMyAdsViewModel };
