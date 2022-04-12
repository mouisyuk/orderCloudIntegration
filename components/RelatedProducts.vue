<template>
  <SfSection :title-heading="title" class="section pdc-sec-title pdp-upsell-section">
    <SfLoader :class="{ loading }" :loading="loading">
      <SfCarousel
        ref="bscarousel"
        data-cy="related-products-carousel"
        :settings="pdpUpsellSettings"
        class="carousel"
      >
        <SfCarouselItem v-for="(product, i) in products" :key="i" class="carousel__item">
          <SfProductCard
            :title="product.Name"
            :image="getDataFromArr(product.xp.Images, 'Url')"
            :link="localePath(`/p/${product.ID}/${product.xp.CategorySeoName}/`)"
            :wishlist-icon="false"
            :image-height="295"
            class="pdp-product-card"
            @click:add-to-cart="handleAddTocart({ProductID: product.ID, Quantity: 1, direction: 'outgoing'})"
          >
            <template #price>
              <SfPrice
                class="sf-product-card__price"
              >
                <template #old><span/></template>
                <template #regular>
                  <span>{{ `${product.xp.Currency} ${getDataFromArr(product.PriceSchedule.PriceBreaks, 'Price')}` }} </span>
                </template>
              </SfPrice>
            </template>
          </SfProductCard>
        </SfCarouselItem>
      </SfCarousel>
    </SfLoader>
  </SfSection>
</template>

<script lang="ts">

import {
  SfCarousel,
  SfProductCard,
  SfSection,
  SfLoader,
  SfLink,
  SfPrice
} from '@storefront-ui/vue';
import { computed } from '@nuxtjs/composition-api';
import { useOrderStore } from '~/store';

export default {
  name: 'RelatedProducts',
  components: {
    SfCarousel,
    SfProductCard,
    SfSection,
    SfLoader,
    SfLink,
    SfPrice
  },
  props: {
    title: String,
    products: Array,
    loading: Boolean
  },
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  setup() {
    const ordersStore = useOrderStore();
    const getDataFromArr = computed(() => {
      return (arr, property) => {
        if(arr.length == 0) return '';

        return arr[0][property];
      }
    });

    const handleAddTocart = async (productData) => {
      await ordersStore.addProductToOrder(productData);
    };

    return {
      getDataFromArr,
      handleAddTocart
    };
  },
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  data () {
    return {
      pdpUpsellSettings: {
        type: 'slider',
        perView: 4,
        peek: 0,
        autoplay: false,
        animationDuration: 600,
        gap: 20,
        breakpoints: {
          1023: {
            perView: 3,
            peek: {
              before: 0,
              after: 72
            }
          },
          767: {
            perView: 2,
            peek: {
              before: 0,
              after: 72
            }
          },
          510: {
            perView: 1,
            peek: {
              before: 0,
              after: 72
            }
          }
        }
      }
    };
  }
};
</script>

<style lang="scss">
.pdp-upsell-section {
  margin: 0;
  @include for-mobile {
    padding-bottom: 40px;
  }
  .sf-section__content {
    margin: 0;
  }
  .sf-carousel {
    @include for-desktop {
      margin: 0 -10px;
    }
  }
  .sf-carousel__controls {
    display: none;
  }
  .sf-product-card__link {
    overflow: hidden;
  }
  .sf-carousel__wrapper {
    max-width: 100%;
    margin: 0;
    @include for-desktop {
      padding: 10px;
    }
  }
  .glide__slide {
    height: auto;
  }

  .carousel__item {
    width: auto;
  }

  .glide__slides {
    justify-content: space-between;
  }
}
</style>
