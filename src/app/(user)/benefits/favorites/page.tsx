import FavoritesPage from '@/components/pages/Favorites/Favorites';

export default function BenefitsFavorites() {
  return (
    <FavoritesPage
      type="benefits"
      breadcrumb={{ text: 'Скидки, льготы', link: '/benefit' }}
    />
  );
}
