import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
export const FETCH_PRODUCT_DETAIL = gql`
    query($sku_product: [String]) {
        products(filter: { sku: { in: $sku_product } }) {
            items {
                sku
                id
                # TODO: Once this issue is resolved we can use a
                # GalleryItemFragment here:
                # https://github.com/magento/magento2/issues/28584
                name
                price {
                    regularPrice {
                        amount {
                            currency
                            value
                        }
                    }
                }
                small_image {
                    url
                }
                mp_label_data {
                    list_position
                    list_position_grid
                    label_image
                    rule_id
                    label_font
                    label_font_size
                    label_color
                    label_template
                    label
                }
                url_key
                url_suffix
                mp_daily_deal {
                    created_at
                    date_from
                    date_to
                    deal_id
                    deal_price
                    remaining_time
                    deal_qty
                    discount_label
                    is_featured
                    product_id
                    product_name
                    product_sku
                    sale_qty
                    status
                    store_ids
                    updated_at
                }
            }
            total_count
            page_info {
                current_page
                page_size
                total_pages
            }
        }
    }
`;

export const useProductDetails = props => {
    const { sku_product } = props;
    const {
        error: detailsError,
        loading: detailsLoading,
        data: detailsData
    } = useQuery(FETCH_PRODUCT_DETAIL, {
        variables: {
            sku_product: sku_product
        },
        fetchPolicy: 'cache-and-network'
    });
    let deriveErrorMessage;
    if (detailsError) {
        const errorTarget = detailsError;
        if (errorTarget.graphQLErrors) {
            // Apollo prepends "GraphQL Error:" onto the message,
            // which we don't want to show to an end user.
            // Build up the error message manually without the prepended text.
            deriveErrorMessage = errorTarget.graphQLErrors
                .map(({ message }) => message)
                .join(', ');
        } else {
            // A non-GraphQL error occurred.
            deriveErrorMessage = errorTarget.message;
        }
    }

    return {
        detailsData,
        detailsLoading,
        deriveErrorMessage
    };
};