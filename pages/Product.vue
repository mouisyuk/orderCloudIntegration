<template>
  <SfLoader
    v-if="productloading"
    class="pdc-pdp-loader"
    :loading="productloading"
  >
    <div />
  </SfLoader>
  <div v-else id="product">
    <SfBreadcrumbs class="breadcrumbs" :breadcrumbs="breadcrumbs">
      <template #link="{ breadcrumb }">
        <nuxt-link
          :data-testid="breadcrumb.text"
          :to="breadcrumb.route.link"
          class="sf-link disable-active-link sf-breadcrumbs__breadcrumb"
        >
          {{ breadcrumb.text }}
        </nuxt-link>
      </template>
    </SfBreadcrumbs>
    <div class="product">
      <SfGallery
        :images="productGallery"
        
        class="product__gallery"
        image-width="422"
        image-height="664"
        thumb-width="160"
        thumb-height="160"
      />
      <div class="product__info">
        <div class="product__header">
          <SfHeading
            :title="productTitle"
            :level="3"
            class="sf-heading--no-underline sf-heading--left"
          />
          <SfIcon
            icon="drag"
            size="xxl"
            color="var(--c-text-disabled)"
            class="product__drag-icon smartphone-only"
          />
        </div>
        <div class="product__price-and-rating">
          <SfPrice
            :regular="productPrice"
          />
          <!-- Reviews Here -->
        </div>
        <div class="product__details">
          <SfAddToCart
            v-model="qty"
            data-cy="product-cart_add"
            class="product__add-to-cart"
          >
            <template #add-to-cart-btn>
              <SfButton
                class="sf-add-to-cart__button"
                @click="
                  ordersStore.addProductToOrder({
                    ProductID: product.ID,
                    Quantity: qty,
                    direction: 'outgoing'
                  })
                "
              >
                Add to Cart
              </SfButton>
            </template>
          </SfAddToCart>
        </div>
        <LazyHydrate when-idle>
          <SfTabs :open-tab="1" class="product__tabs">
            <SfTab data-cy="product-tab_description" title="Description">
              <div v-if="productDescription" class="product__description">
                <div v-html="productDescription"></div>
              </div>
              <SfProperty
                v-for="(property, i) in properties"
                :key="i"
                :name="property.name"
                :value="property.value"
                class="product__property"
              >
                <template v-if="property.name === 'Category'" #value>
                  <SfButton class="product__property__button sf-button--text">
                    {{ property.value }}
                  </SfButton>
                </template>
              </SfProperty>
            </SfTab>
            <SfTab
              :title="$t('Additional Information')"
              data-cy="product-tab_additional"
              class="product__additional-info"
            >
              <div class="product__additional-info">
                <p class="product__additional-info__title">
                  {{ $t('Brand') }}
                </p>
                <p>{{ brand }}</p>
                <p class="product__additional-info__title">
                  {{ $t('Instruction1') }}
                </p>
                <p class="product__additional-info__paragraph">
                  {{ $t('Instruction2') }}
                </p>
                <p class="product__additional-info__paragraph">
                  {{ $t('Instruction3') }}
                </p>
                <p>{{ careInstructions }}</p>
              </div>
            </SfTab>
          </SfTabs>
        </LazyHydrate>
      </div>
    </div>
    <!-- <LazyHydrate when-visible>
      <RelatedProducts
        :products="relatedProducts"
        :loading="relatedLoading"
        title="Match it with"
      />
    </LazyHydrate> -->
    <LazyHydrate when-visible>
      <InstagramFeed />
    </LazyHydrate>
    <LazyHydrate when-visible>
      <MobileStoreBanner />
    </LazyHydrate>
  </div>
</template>
<script>
import {
  SfProperty,
  SfHeading,
  SfPrice,
  SfRating,
  SfSelect,
  SfColorPicker,
  SfAddToCart,
  SfTabs,
  SfGallery,
  SfIcon,
  SfImage,
  SfBadge,
  SfBanner,
  SfAlert,
  SfSticky,
  SfReview,
  SfBreadcrumbs,
  SfLoader,
  SfButton,
  SfColor
} from '@storefront-ui/vue';

import InstagramFeed from '~/components/InstagramFeed.vue';
import RelatedProducts from '~/components/RelatedProducts.vue';
import { ref, computed, watch, reactive, onMounted } from '@nuxtjs/composition-api';
import { useProduct, useCart, productGetters } from '@vue-storefront/shopify';
import MobileStoreBanner from '~/components/MobileStoreBanner.vue';
import LazyHydrate from 'vue-lazy-hydration';
import { onSSR } from '@vue-storefront/core';
import useUiNotification from '~/composables/useUiNotification';
import { useMeStore, useOrderStore } from '~/store';
import _ from 'lodash';

export default {
  name: 'Product',
  components: {
    SfAlert,
    SfColor,
    SfLoader,
    SfProperty,
    SfHeading,
    SfPrice,
    SfRating,
    SfSelect,
    SfAddToCart,
    SfTabs,
    SfGallery,
    SfIcon,
    SfImage,
    SfBanner,
    SfSticky,
    SfReview,
    SfBadge,
    SfBreadcrumbs,
    SfButton,
    InstagramFeed,
    RelatedProducts,
    MobileStoreBanner,
    LazyHydrate
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from;
    });
  },
  transition: 'fade',
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  setup(props, context) {
    const breadcrumbs = ref([]);
    const atttLbl = '';
    const qty = ref(1);
    const { id, slug } = context.root.$route.params;
    const meStore = useMeStore();
    const ordersStore = useOrderStore();
    const {
      products,
      search
    } = useProduct('products');
    const { send: sendNotification } = useUiNotification();
    const {
      products: relatedProducts,
      search: searchRelatedProducts,
      loading: relatedLoading
    } = useProduct('relatedProducts');
    const { addItem, loading } = useCart();
    const productloading = ref(true);
    const product = ref({});
    
    const productTitle = computed(() => {
      const res =_.get(product.value, 'Name');
  

      return res 
    });
    const productCoverImage = computed(() => _.get(product.value, 'xp.Images[0].Url'));
    const productDescription = computed(() => _.get(product.value, 'Description')); 

    const setBreadcrumb = () => {
      breadcrumbs.value = [
        {
          text: 'Home',
          route: { link: '/' }
        },
        {
          text: 'products',
          route: { link: '#' }
        },
        {
          text: productTitle.value,
          route: { link: '#' }
        }
      ];
    };

    watch(
      productTitle,
      (currproductTitle, prevproductTitle) => {
        if (currproductTitle !== prevproductTitle) {
          setBreadcrumb();
        }
      },
      { deep: true }
    );

    const productGallery = computed(() => {
      const images = _.get(product.value, 'xp.Images');

      return images?.map((img) => ({
        mobile: { url: img.ThumbnailUrl },
        desktop: { url: img.Url },
        big: { url: img.Url },
        alt: _.get(product.value, 'Name')
      }) || [] );
    });
    
    const ActiveVariantImage = computed(() => {
      return 0;
    });

    const properties = computed(() => {
      let country = _.get(product.value, 'xp.Facets.countryoforigin');

      if(country) country = country.join();

      return [
        {
          name: 'Product Code',
          value: _.get(product.value, 'ShipFromAddressID')
        },
        {
          name: 'Category',
          value: _.get(product.value, 'xp.CategorySeoName')
        },
        {
          name: 'Country',
          value: country
        }
      ];
    });

    const productPrice = computed(() => {
      return `${_.get(product.value, 'xp.Currency')} ${_.get(product.value, 'PriceSchedule.PriceBreaks[0].Price')}`;
    });

    onSSR(async () => {
      if(!product.value)  return context.root.error({
        statusCode: 404,
        message: 'This product could not be found'
      });
    });

    onMounted(async() => {
      product.value = await meStore.getProductById(id);
      productloading.value = false;
    });

    return {
      product,
      productDescription,
      productCoverImage,
      ActiveVariantImage,
      sendNotification,
      properties,
      productPrice,
      // relatedProducts: computed(() =>
      //   productGetters.getFiltered(relatedProducts.value, { master: true })
      // ),
      relatedLoading,
      productTitle,
      breadcrumbs,
      qty,
      addItem,
      loading,
      productloading,
      productGallery,
      // productGetters,
      setBreadcrumb,
      ordersStore,
      atttLbl
    };
  },
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  data() {
    return {
      description:
        'Find stunning women cocktail and party dresses. Stand out in lace and metallic cocktail dresses and party dresses from all your favorite brands.',
      detailsIsActive: false,
      brand:
        'Brand name is the perfect pairing of quality and design. This label creates major everyday vibes with its collection of modern brooches, silver and gold jewellery, or clips it back with hair accessories in geo styles.',
      careInstructions: 'Do not wash!'
    };
  },
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  mounted() {
    window.addEventListener('load', () => {
      this.setGalleryWidth();
    });
    this.$nextTick(() => {
      this.setGalleryWidth();
      this.setBreadcrumb();
      window.addEventListener('resize', this.setGalleryWidth);
    });
  },
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  updated() {
    this.setGalleryWidth();
  },
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  methods: {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async addingToCart(Productdata) {
      await this.addItem(Productdata).then(() => {
        this.sendNotification({
          key: 'product_added',
          message: `${Productdata.product.name} has been successfully added to your cart.`,
          type: 'success',
          title: 'Product added!',
          icon: 'check'
        });
        this.qty = 1;
      });
    },
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    updatedQuantity(value) {
      this.qty = value;
    },
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    setGalleryWidth() {
      const gallary = document.getElementsByClassName('product__gallery');
      const gallerySlider =
        gallary.length > 0 && gallary[0].querySelectorAll('.glide__slides');
      const galleryAllSlides =
        gallerySlider.length > 0 &&
        gallerySlider[0].querySelectorAll('.glide__slide');
      typeof galleryAllSlides !== 'boolean' &&
        galleryAllSlides.length > 0 &&
        galleryAllSlides.forEach((gallerySlide) => {
          gallerySlide.style.flexBasis = gallerySlide.style.width;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.pdc-pdp-loader {
  min-height: 200px;
  padding: 100px 0;
}

#product {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1272px;
    margin: 0 auto;
  }
}
.product {
  @include for-desktop {
    display: flex;
  }
  &__info {
    margin: var(--spacer-sm) auto;
    @include for-desktop {
      max-width: 32.625rem;
      margin: 0 0 0 7.5rem;
    }
  }
  &__header {
    --heading-title-color: var(--c-link);
    --heading-title-font-weight: var(--font-weight--bold);
    --heading-padding: 0;
    margin: 0 var(--spacer-sm);
    display: flex;
    justify-content: space-between;
    @include for-desktop {
      --heading-title-font-weight: var(--font-weight--semibold);
      margin: 0 auto;
    }
  }
  &__drag-icon {
    animation: moveicon 1s ease-in-out infinite;
  }
  &__price-and-rating {
    margin: 0 var(--spacer-sm) var(--spacer-base);
    align-items: center;
    @include for-desktop {
      display: flex;
      justify-content: space-between;
      margin: var(--spacer-sm) 0 var(--spacer-lg) 0;
    }
  }
  &__rating {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin: var(--spacer-xs) 0 var(--spacer-xs);
  }
  &__count {
    @include font(
      --count-font,
      var(--font-weight--normal),
      var(--font-size--sm),
      1.4,
      var(--font-family--secondary)
    );
    color: var(--c-text);
    text-decoration: none;
    margin: 0 0 0 var(--spacer-xs);
  }
  &__details {
    margin: 0 var(--spacer-sm) var(--spacer-base);

    @include for-desktop {
      margin: var(--spacer-lg) 0;
    }
  }
  &__description {
    @include font(
      --product-description-font,
      var(--font-weight--light),
      var(--font-size--base),
      1.6,
      var(--font-family--primary)
    );
  }
  &__colors {
    @include font(
      --product-color-font,
      var(--font-weight--normal),
      var(--font-size--xs),
      1.6,
      var(--font-family--secondary)
    );
    display: flex;
    flex-wrap: wrap;
  }
  &__color-label {
    margin: 0 var(--spacer-lg) var(--spacer-xs) 0;
    padding: 0 0 0 4px;
  }
  &__color {
    margin: 0 var(--spacer-2xs);
  }
  &__add-to-cart,
  &__stock-information {
    margin-top: var(--spacer-xl);
  }
  &__guide,
  &__compare,
  &__save {
    display: block;
    margin: var(--spacer-xl) 0 var(--spacer-base) auto;
  }
  &__compare {
    margin-top: 0;
  }
  &__tabs {
    margin: var(--spacer-lg) auto var(--spacer-2xl);
    --tabs-title-font-size: var(--font-size--lg);
    @include for-desktop {
      margin-top: var(--spacer-2xl);
    }
  }
  &__property {
    margin: var(--spacer-base) 0;
    &__button {
      text-transform: capitalize;
      --button-font-size: var(--font-size--base);
    }
  }
  &__review {
    padding-bottom: 24px;
    border-bottom: var(--c-light) solid 1px;
    margin-bottom: var(--spacer-base);
  }
  &__additional-info {
    color: var(--c-link);
    @include font(
      --additional-info-font,
      var(--font-weight--light),
      var(--font-size--sm),
      1.6,
      var(--font-family--primary)
    );
    &__title {
      font-weight: var(--font-weight--normal);
      font-size: var(--font-size--base);
      margin: 0 0 var(--spacer-sm);
      &:not(:first-child) {
        margin-top: 3.5rem;
      }
    }
    &__paragraph {
      margin: 0;
    }
  }
  &__gallery {
    flex: 1;
  }
  &__flex-break {
    flex-basis: 100%;
    height: 0;
  }
}
.breadcrumbs {
  margin: var(--spacer-base) auto var(--spacer-lg);
}
.banner-app {
  --banner-container-width: 100%;
  --banner-title-margin: var(--spacer-base) 0 var(--spacer-xl) 0;
  --banner-padding: 0 var(--spacer-2xl);
  --banner-title-font-size: var(--h1-font-size);
  --banner-subtitle-font-size: var(--font-size--xl);
  --banner-title-font-weight: var(--font-weight--semibold);
  --banner-subtitle-font-weight: var(--font-weight--medium);
  --banner-title-text-transform: capitalize;
  --banner-subtitle-text-transform: capitalize;
  display: block;
  min-height: 26.25rem;
  max-width: 65rem;
  margin: 0 auto;
  padding: 0 calc(25% + var(--spacer-2xl)) 0 var(--spacer-xl);
  &__call-to-action {
    --button-background: transparent;
    display: flex;
  }
  &__button {
    --image-width: 8.375rem;
    --image-height: 2.75rem;
    --button-padding: 0;
    & + & {
      margin: 0 0 0 calc(var(--spacer-xl) / 2);
    }
  }
}
@keyframes moveicon {
  0% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(0, 30%, 0);
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
}
</style>
