<template>
  <div id="home">
    <SfHero class="hero">
      <SfHeroItem
        v-for="(hero, i) in heroes"
        :key="i"
        :title="hero.title"
        :subtitle="hero.subtitle"
        :button-text="hero.buttonText"
        :background="hero.background"
        :image="hero.image"
        :class="hero.className"
      />
    </SfHero>
    <LazyHydrate when-visible>
      <RelatedProducts
        :products="products"
        :loading="productsLoading"
        title="Related products"
      />
    </LazyHydrate>
    <LazyHydrate when-visible>
      <SfSection
        titleHeading="Yamama Cement Company | Saudi Arabia"
        :levelHeading="2"
        class="video-section"
      >
        <iframe
          class="frame-video"
          src="https://www.youtube.com/embed/BkB8hXlroXY"
        ></iframe>
      </SfSection>
    </LazyHydrate>
  </div>
</template>
<script type="module">
import {
  SfHero,
  SfBanner,
  SfCallToAction,
  SfSection,
  SfCarousel,
  SfImage,
  SfBannerGrid,
  SfHeading,
  SfArrow,
  SfButton
} from '@storefront-ui/vue';
import {
  ref,
  computed,
  onMounted
} from '@nuxtjs/composition-api';
import LazyHydrate from 'vue-lazy-hydration';
import MobileStoreBanner from '~/components/MobileStoreBanner.vue';
import RelatedProducts from '~/components/RelatedProducts.vue';
import { useMeStore } from '~/store';

export default {
  name: 'Home',
  components: {
    SfHero,
    RelatedProducts,
    SfBanner,
    SfCallToAction,
    SfSection,
    SfCarousel,
    SfImage,
    SfBannerGrid,
    SfHeading,
    SfArrow,
    SfButton,
    MobileStoreBanner,
    LazyHydrate
  },
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  setup(contect) {
    const productsLoading = ref(true);
    const meStore = useMeStore();
    const heroes = [
      {
        background: '#eceff1',
        image: {
          desktop:
            '/homepage/yamamaBulding2.jpg'
        }
      },
      {
        background: '#eceff1',
        image: {
          desktop:
            '/homepage/banner2.png'
        }
      }
      
    ];

    const products = computed(() => meStore?.listProducts?.Items)

    onMounted(async () => {
      await meStore.getListProducts({pageSize: '4'});
      productsLoading.value = false;
    });

    return {
      productsLoading,
      meStore,
      heroes,
      products
    };
  },
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
};
</script>

<style lang="scss" scoped>
#home {
  box-sizing: border-box;
  padding: 0 var(--spacer-sm);
  @include for-desktop {
    max-width: 1240px;
    padding: 0;
    margin: 0 auto;
  }
}
.hero {
  margin: var(--spacer-xl) auto var(--spacer-lg);
  --hero-item-background-position: center;
  @include for-desktop {
    margin: var(--spacer-xl) auto var(--spacer-2xl);
  }
  .sf-hero-item {
    &:nth-child(even) {
      --hero-item-background-position: left;
      @include for-mobile {
        --hero-item-background-position: 30%;
        ::v-deep .sf-hero-item__subtitle,
        ::v-deep .sf-hero-item__title {
          text-align: right;
          width: 100%;
          padding-left: var(--spacer-sm);
        }
      }
    }
  }
  ::v-deep .sf-hero__control {
    &--right,
    &--left {
      display: none;
    }
  }
}
.banner-grid {
  --banner-container-width: 50%;
  margin: var(--spacer-xl) 0;
  ::v-deep .sf-link:hover {
    color: var(--c-white);
  }
  @include for-desktop {
    margin: var(--spacer-2xl) 0;
    ::v-deep .sf-link {
      --button-width: auto;
      text-decoration: none;
    }
  }
}
.banner {
  &__tshirt {
    background-position: left;
  }
  &-central {
    @include for-desktop {
      --banner-container-flex: 0 0 70%;
    }
  }
}
.similar-products {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--spacer-2xs);
  --heading-padding: 0;
  border-bottom: 1px var(--c-light) solid;
  @include for-desktop {
    border-bottom: 0;
    justify-content: center;
    padding-bottom: 0;
  }
}
.call-to-action {
  background-position: right;
  margin: var(--spacer-xs) 0;
  @include for-desktop {
    margin: var(--spacer-xl) 0 var(--spacer-2xl) 0;
  }
}
.carousel {
  margin: 0 calc(0 - var(--spacer-sm)) 0 0;
  @include for-desktop {
    margin: 0;
  }
  &__item {
    margin: 1.375rem 0 2.5rem 0;
    @include for-desktop {
      margin: var(--spacer-xl) 0 var(--spacer-xl) 0;
    }
    &__product {
      --product-card-add-button-transform: translate3d(0, 30%, 0);
    }
  }
  ::v-deep .sf-arrow--long .sf-arrow--right {
    --arrow-icon-transform: rotate(180deg);
    -webkit-transform-origin: center;
    transform-origin: center;
  }
}

.video-section {
  margin: 2.5rem 0;
}

.frame-video {
  width: 100%;
  height: 600px;
}
</style>
