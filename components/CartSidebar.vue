<template>
  <div id="cart">
    <SfSidebar
      v-e2e="'sidebar-cart'"
      :visible="isCartSidebarOpen"
      title="My Cart"
      class="sf-sidebar--right"
      @close="toggleCartSidebar"
    >
      <template #content-top>
        <SfProperty
          v-if="totalItems"
          class="sf-property--large cart-summary desktop-only"
          name="Total items"
          :value="totalItems"
        />
      </template>
      <transition name="sf-fade" mode="out-in">
        <div v-if="totalItems" key="my-cart" class="my-cart">
          <div class="collected-product-list">
            <transition-group name="sf-fade" tag="div">
              <SfCollectedProduct
                v-for="item in lineItems.Items"
                :key="item.ID"
                v-e2e="'collected-product'"
                :image="productImage(item)"
                :title="item.Product.Name"
                :regular-price="`${item.Product.xp.Currency} ${item.UnitPrice}`"
                class="collected-product"
                @click:remove="removeItem(item.ID)"
              >
                <template #input>
                  <div class="sf-collected-product__quantity-wrapper">
                    <SfQuantitySelector
                      :disabled="loading"
                      :qty="item.Quantity"
                      class="sf-collected-product__quantity-selector"
                      @input="updateQuantity({ item, Quantity: Number($event) })"
                    />
                  </div>
                </template>
              </SfCollectedProduct>
            </transition-group>
          </div>
        </div>
        <div v-else key="empty-cart" class="empty-cart">
          <div class="empty-cart__banner">
            <SfImage
              alt="Empty bag"
              class="empty-cart__image"
              src="/icons/empty-cart.svg"
            />
            <SfHeading
              title="Your cart is empty"
              :level="2"
              class="empty-cart__heading"
              description="Looks like you haven’t added any items to the bag yet. Start
              shopping to fill it in."
            />
          </div>
        </div>
      </transition>
      <template #content-bottom>
        <transition name="sf-fade">
          <div v-if="totalItems">
            <SfProperty
              name="Estimated Total"
              class="sf-property--full-width sf-property--large my-cart__total-price"
            >
              <template #value>
                <SfPrice
                  :regular="totalPrice"
                />
              </template>
            </SfProperty>
            <SfButton
                class="sf-button--full-width color-secondary sf-proceed_to_checkout"
                style="margin-bottom: 12px"
                @click="handleDeleteOrder"
              >
                {{ $t('Delete order') }}
              </SfButton>
            <SfLink link="javascript:void(0);" @click="handleCheckout(checkoutURL, parseFloat(totals.subtotal))">
              <SfButton
                class="sf-button--full-width color-secondary sf-proceed_to_checkout"
                @click="toggleCartSidebar"
              >
                {{ $t('Go to checkout') }}
              </SfButton>
            </SfLink>
            </div>
          <div v-else>
            <SfButton
              class="sf-button--full-width color-primary"
              @click="toggleCartSidebar"
            >{{ $t('Go back shopping') }}</SfButton
            >
          </div>
        </transition>
      </template>
    </SfSidebar>
  </div>
</template>
<script>
import {
  SfSidebar,
  SfHeading,
  SfButton,
  SfProperty,
  SfPrice,
  SfCollectedProduct,
  SfImage,
  SfLink,
  SfQuantitySelector
} from '@storefront-ui/vue';
import { computed, onMounted } from '@nuxtjs/composition-api';
import { useCart, useUser, cartGetters } from '@vue-storefront/shopify';
import { useUiState, useUiNotification } from '~/composables';
import { useMeStore, useOrderStore, useLineItemsStore } from '~/store';
import _ from 'lodash';
import { storeToRefs } from 'pinia'

export default {
  name: 'Cart',
  components: {
    SfSidebar,
    SfButton,
    SfHeading,
    SfLink,
    SfProperty,
    SfPrice,
    SfCollectedProduct,
    SfImage,
    SfQuantitySelector
  },
  setup() {
    const { isCartSidebarOpen, toggleCartSidebar } = useUiState();
    const { cart, updateItemQty, loading } = useCart();
    const { isAuthenticated } = useUser();
    const { send: sendNotification, notifications } = useUiNotification();
    const meStore = useMeStore();
    const { deleteOrder } = useOrderStore();
    const lineItemsStore = useLineItemsStore();
    const { updateLineItem, deleteLineItem } = lineItemsStore;
    const { lineItems } = storeToRefs(lineItemsStore);
    const totals = computed(() => cartGetters.getTotals(cart.value));
    const lineItemsSubtotalPrice = computed(() => cartGetters.getSubTotal(cart.value));
    const totalItems = computed(() => meStore.orders?.Items[0]?.LineItemCount);
    const totalPrice = computed(() => `USD ${meStore.orders?.Items[0].Total}`);
    
    const checkoutURL = computed(() => cartGetters.getcheckoutURL(cart.value));
    const handleCheckout = (checkoutUrl) => {
      setTimeout(() => {
        window.location.replace(checkoutUrl)
      }, 400)
    };

    const productImage  = computed(() => (item) => _.get(item, 'Product.xp.Images[0].Url'));

    const updateQuantity = _.debounce(async ({ item, Quantity }) => {
      await updateLineItem({
        direction: 'outgoing',
        lineItemID: item.ID,
        orderID: _.get(meStore, 'orders.Items[0].ID'),
        ProductID: item.ProductID,
        Quantity
      });
    }, 500);

    const removeItem = async (itemId) => {
      await deleteLineItem(itemId);
    };

    const handleDeleteOrder = async () => {
      await deleteOrder({
        direction: "outgoing",
        orderID: _.get(meStore, 'orders.Items[0].ID')
      });
    };

    return {
      updateQuantity,
      loading,
      lineItems,
      isAuthenticated,
      removeItem,
      handleCheckout,
      checkoutURL,
      isCartSidebarOpen,
      toggleCartSidebar,
      totals,
      lineItemsSubtotalPrice,
      totalItems,
      totalPrice,
      cartGetters,
      sendNotification,
      notifications,
      productImage,
      handleDeleteOrder
    };
  }
};
</script>

<style lang="scss" scoped>
#cart {
  --sidebar-z-index: 3;
  --overlay-z-index: 3;
  @include for-desktop {
    & > * {
      --sidebar-bottom-padding: var(--spacer-base);
      --sidebar-content-padding: var(--spacer-base);
    }
  }
}
.cart-summary {
  margin-top: var(--spacer-xl);
}
.my-cart {
  flex: 1;
  display: flex;
  flex-direction: column;
  &__total-items {
    margin: 0;
  }
  &__total-price {
    --price-font-size: var(--font-size--xl);
    --price-font-weight: var(--font-weight--medium);
    margin: 0 0 var(--spacer-base) 0;
  }
}
.empty-cart {
  --heading-description-margin: 0 0 var(--spacer-xl) 0;
  --heading-title-margin: 0 0 var(--spacer-xl) 0;
  --heading-title-color: var(--c-primary);
  --heading-title-font-weight: var(--font-weight--semibold);
  display: flex;
  flex: 1;
  align-items: center;
  flex-direction: column;
  &__banner {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    flex: 1;
  }
  &__heading {
    padding: 0 var(--spacer-base);
  }
  &__image {
    --image-width: 16rem;
    margin: 0 0 var(--spacer-2xl) 7.5rem;
  }
  @include for-desktop {
    --heading-title-font-size: var(--font-size--xl);
    --heading-title-margin: 0 0 var(--spacer-sm) 0;
  }
}
.collected-product-list {
  flex: 1;
}
.collected-product {
  margin: 0 0 var(--spacer-sm) 0;
  &__properties {
    margin: var(--spacer-xs) 0 0 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-start;
    flex: 2;
    &:first-child {
      margin-bottom: 8px;
    }
  }
  &__actions {
    transition: opacity 150ms ease-in-out;
  }
  &__save,
  &__compare {
    --button-padding: 0;
    &:focus {
      --cp-save-opacity: 1;
      --cp-compare-opacity: 1;
    }
  }
  &__save {
    opacity: var(--cp-save-opacity, 0);
  }
  &__compare {
    opacity: var(--cp-compare-opacity, 0);
  }
  &:hover {
    --cp-save-opacity: 1;
    --cp-compare-opacity: 1;
    @include for-desktop {
      .collected-product__properties {
        display: none;
      }
    }
  }
}
</style>