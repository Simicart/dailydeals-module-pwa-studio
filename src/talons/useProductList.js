import gql from 'graphql-tag'
import { useQuery } from '@apollo/client';
export const FETCH_LIST_PRODUCT = gql`
        query { 
            MpDailyDeals(filter:{product_sku:{neq:"24-WG022"}} 
                currentPage: 1
                pageSize:21
            )
            {
                items {
                created_at
                date_from
                date_to
                deal_id
                deal_price
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
                
                total_count
            }
        }
    `;

export const useProductList = () => {

    const { error: productListError,
        loading: productListLoading,
        data: productListData } = useQuery(FETCH_LIST_PRODUCT, { fetchPolicy: 'cache-and-network' });
    let derivedErrorMessage;
    if (productListError) {
        const errorTarget = productListError;
        if (errorTarget.graphQLErrors) {
            // Apollo prepends "GraphQL Error:" onto the message,
            // which we don't want to show to an end user.
            // Build up the error message manually without the prepended text.
            derivedErrorMessage = errorTarget.graphQLErrors
                .map(({ message }) => message)
                .join(', ');
        } else {
            // A non-GraphQL error occurred.
            derivedErrorMessage = errorTarget.message;
        }
    }

    return {
        productListData,
        productListLoading,
        derivedErrorMessage
    }

}