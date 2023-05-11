import { makeAutoObservable } from "mobx";
import { NavigationEnum } from "../../utils/navigation.enum";

export class Navigation {

    currentTab: NavigationEnum = NavigationEnum.None;

    constructor() {
        makeAutoObservable(this)
    }

    setCurrentTab(value: any) {
        this.currentTab = value
    }

}