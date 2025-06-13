import React, { useState } from 'react';
import {
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonTitle,
  IonSearchbar,
  IonToolbar,
} from '@ionic/react';
import type { CheckboxCustomEvent } from '@ionic/react';

import { deportistaService } from '../services/deportistas.service';

interface Item {
  id: string | number;
  text: string;
}

interface TypeaheadProps {
  items: Item[];
  selectedItems: Item[];
  title?: string;
  onSelectionCancel?: () => void;
  onSelectionChange?: (items: Item[]) => void;
}

function AppTypeahead(props: TypeaheadProps) {
  const [filteredItems, setFilteredItems] = useState<Item[]>([...props.items]);
  const [workingSelectedValues, setWorkingSelectedValues] = useState<Item[]>([...props.selectedItems]);

  const isChecked = (item: Item) => {
    return workingSelectedValues.find((selected) => selected.id === item.id) !== undefined;
  };

  const cancelChanges = () => {
    const { onSelectionCancel } = props;
    if (onSelectionCancel !== undefined) {
      onSelectionCancel();
    }
  };

  const confirmChanges = () => {
    const { onSelectionChange } = props;
    if (onSelectionChange !== undefined) {
      onSelectionChange(workingSelectedValues);
    }
  };

  const searchbarInput = (event: any) => {
    filterList(event.target.value);
  };

  /**
   * Update the rendered view with
   * the provided search query. If no
   * query is provided, all data
   * will be rendered.
   */
  const filterList = (searchQuery: string | null | undefined) => {
    /**
     * If no search query is defined,
     * return all options.
     */
    if (searchQuery === undefined || searchQuery === null) {
      setFilteredItems([...props.items]);
    } else {
      /**
       * Otherwise, normalize the search
       * query and check to see which items
       * contain the search query as a substring.
       */
      const normalizedQuery = searchQuery.toLowerCase();
      setFilteredItems(
        props.items.filter((item) => {
          return item.text.toLowerCase().includes(normalizedQuery);
        })
      );
    }
  };

  const checkboxChange = (event: CheckboxCustomEvent, item: Item) => {
    const { checked } = event.detail;

    if (checked) {
      setWorkingSelectedValues([...workingSelectedValues, item]);
    } else {
      setWorkingSelectedValues(workingSelectedValues.filter((selected) => selected.id !== item.id));
    }
  };

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={cancelChanges}>Cancelar</IonButton>
          </IonButtons>
          <IonTitle>{props.title}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={confirmChanges}>Listo</IonButton>
          </IonButtons>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar onIonInput={searchbarInput}></IonSearchbar>
        </IonToolbar>
      </IonHeader>

      <IonContent color="light" class="ion-padding">
        <IonList id="modal-list" inset={true}>
          {filteredItems.map((item) => (
            <IonItem key={item.id}>
              <IonCheckbox 
                checked={isChecked(item)} 
                onIonChange={(e) => checkboxChange(e, item)}
              >
                {item.text}
              </IonCheckbox>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </>
  );
}
export default AppTypeahead;