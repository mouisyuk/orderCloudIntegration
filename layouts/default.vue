<template>
  <div>
    <TopBar class="desktop-only" />
    <AppHeader
      :cart-total-items="getCartTotalItems"
      :is-user-authenticated="!isAnonymous"
    />
    <div id="layout">
      <nuxt :key="$route.fullPath" />
      <client-only>
        <BottomNavigation />
      </client-only>
      <client-only>
        <CartSidebar />
      </client-only>
      <client-only>
        <WishlistSidebar />
      </client-only>
      <client-only>
        <LoginModal />
      </client-only>
      <client-only>
        <Notification />
      </client-only>
    </div>
    <LazyHydrate when-visible>
      <AppFooter />
    </LazyHydrate>
  </div>
</template>

<script>
import AppHeader from '~/components/AppHeader.vue';
import TopBar from '~/components/TopBar.vue';
import LazyHydrate from 'vue-lazy-hydration';
import {
  useUser,
  cartGetters,
  useCart,
} from '@vue-storefront/shopify';
import { computed, onBeforeMount, onMounted } from '@nuxtjs/composition-api';
import { useMeStore, useOrderStore, useAuthenticationStore } from '~/store';
import { storeToRefs } from 'pinia'

export default {
  name: 'DefaultLayout',
  components: {
    TopBar,
    AppHeader,
    LazyHydrate,
    BottomNavigation: () => import('~/components/BottomNavigation.vue'),
    AppFooter: () => import('~/components/AppFooter.vue'),
    CartSidebar: () => import('~/components/CartSidebar.vue'),
    WishlistSidebar: () => import('~/components/WishlistSidebar.vue'),
    LoginModal: () => import('~/components/LoginModal.vue'),
    Notification: () => import('~/components/Notification'),
  },
  setup(_, { root }) {
    const meStore = useMeStore();
    const orderStore = useOrderStore();
    const authenticationStore = useAuthenticationStore();
    const getCartTotalItems = computed(() => meStore.orders?.Items[0]?.LineItemCount);
    const { isAnonymous } = storeToRefs(authenticationStore);

    onBeforeMount(async () => {
      await meStore.initializeMe();
      await meStore.getMyOrders({
        filters: {
          Status: 'Unsubmitted'
        }
      });
      await orderStore.getWorksheet({
        direction: "outgoing",
        orderID: meStore?.orders?.Items[0]?.ID
      });
    });

    onMounted(() => {
      console.log(process.env.NODE_ENV, '------- ENV ------');
    });

    return {
      getCartTotalItems,
      isAnonymous
    };
  },
};
</script>

<style lang="scss">
@import '~@storefront-ui/vue/styles';

#layout {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1240px;
    margin: auto;
  }
}

.no-scroll {
  overflow: hidden;
  height: 100vh;
}

// Reset CSS
html {
  width: auto;
  @include for-mobile {
    overflow-x: hidden;
  }
}
body {
  overflow-x: hidden;
  color: var(--c-text);
  font-size: var(--font-size--base);
  font-family: var(--font-family--primary);
  margin: 0;
  padding: 0;
}
a {
  text-decoration: none;
  color: var(--c-link);
  &:hover {
    color: var(--c-link-hover);
  }
}
h1 {
  font-family: var(--font-family--secondary);
  font-size: var(--h1-font-size);
  line-height: 1.6;
  margin: 0;
}
h2 {
  font-family: var(--font-family--secondary);
  font-size: var(--h2-font-size);
  line-height: 1.6;
  margin: 0;
}
h3 {
  font-family: var(--font-family--secondary);
  font-size: var(--h3-font-size);
  line-height: 1.6;
  margin: 0;
}
h4 {
  font-family: var(--font-family--secondary);
  font-size: var(--h4-font-size);
  line-height: 1.6;
  margin: 0;
}
</style>
