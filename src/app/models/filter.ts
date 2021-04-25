import { AutocompleteElement } from "./autocomplete.category";
import { TransactionTypes } from "./transaction-types";

export class Filter {
    startDate?: Date;
    endDate?: Date;
    categories?: AutocompleteElement[];
    accounts?: AutocompleteElement[];
    types?: TransactionTypes[];
    clearFilters?: boolean;
}