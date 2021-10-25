import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
export const FETCH_STORE_CONFIG = gql`
query getStore {
    storeConfig {
      id
      store_name
      copyright
      mp_dailydeal_enabled
      mp_dailydeal_show_qty_remain
      mp_dailydeal_show_qty_sold 
      mp_dailydeal_show_countdown_timer
      mp_dailydeal_clock_style
      mp_dailydeal_countdown_outer_color
      mp_dailydeal_countdown_inner_color
      mp_dailydeal_countdown_number_color
      mp_dailydeal_countdown_text
      mp_dailydeal_show_discount_label
      mp_dailydeal_content_label
      mp_dailydeal_round_percent
      mp_dailydeal_show_on
      mp_dailydeal_label_bg_color
      mp_dailydeal_label_border_color
      mp_dailydeal_label_text_color
      mp_dailydeal_all_deals_enabled 
      mp_dailydeal_all_deals_route
      mp_dailydeal_all_deals_title
      mp_dailydeal_new_deals_enabled 
      mp_dailydeal_new_deals_route
      mp_dailydeal_new_deals_title
      mp_dailydeal_best_deals_enabled 
      mp_dailydeal_best_deals_route
      mp_dailydeal_best_deals_title
      mp_dailydeal_featured_deals_enabled 
      mp_dailydeal_featured_deals_route
      mp_dailydeal_featured_deals_title
    }
  }
`;

export const useStoreConfig = props => {
    const {
        error: storeConfigError,
        loading: storeConfigLoading,
        data: storeConfigData
    } = useQuery(FETCH_STORE_CONFIG, { fetchPolicy: "cache-and-network" });

    let storeConfigErrorMessage;
    if (storeConfigError) {
        const errorTarget = storeConfigError;
        if (errorTarget.graphQLErrors) {
            // Apollo prepends "GraphQL Error:" onto the message,
            // which we don't want to show to an end user.
            // Build up the error message manually without the prepended text.
            storeConfigErrorMessage = errorTarget.graphQLErrors
                .map(({ message }) => message)
                .join(', ');
        } else {
            // A non-GraphQL error occurred.
            storeConfigErrorMessage = errorTarget.message;
        }
    }

    return {
        storeConfigError,
        storeConfigLoading,
        storeConfigData
    };
};