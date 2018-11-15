'use strict';
import {
	PromoModel
} from "./PromoModel.js";
import {
	PromoView
} from "./PromoView.js";
import {
	PromoController
} from "./PromoController.js";
import {
	PopupView
} from "./PopupView.js";
import {
	PopupController
} from "./PopupController.js";

import {
	DashboardModel
} from "./DashboardModel.js";
import {
	DashboardView
} from "./DashboardView.js";
import {
	DashboardController
} from "./DashboardController.js";

import {
	ProjectModel
} from "./ProjectModel.js";
import {
	UserWinView
} from "./UserWinView.js";
import {
	UserWinController
} from "./UserWinController.js";
import {
	OutputView
} from "./OutputView.js";
import {
	OutputController
} from "./OutputController.js";


export class Router {
	constructor() {
		this.user = localStorage.user;

		this.modelOfPromo = null;
		this.viewOfPromo = null;
		this.controllerOfPromo = null;
		this.viewOfPopup = null;
		this.controllerOfPopup = null;

		this.modelOfList = null;
		this.viewOfList = null;
		this.controllerOfList = null;

		this.modelOfProject = null;
		this.viewOfuser = null;
		this.controllerOfUser = null;
		this.viewOfOutput = null;
		this.controllerOfOutput = null;

		//Подписаться на событие hashchange
		window.addEventListener('hashchange', this.onhashchange.bind(this));


		if (!localStorage.user) { //!localStorage.user - при пустом попадаем на промо
			this.navigateTo('#promo');

		} else {

			if (document.location.hash === '' || document.location.hash === '#promo') {
				//при загрузке сразу попадаем на стену
				this.navigateTo('#dashboard');
			} else {
				//иначе переходим по введённому хешу
				this.navigateTo(document.location.hash);
			}
		}

	}

	onhashchange() {
		const activeHash = document.location.hash;
		// Отрисовать страницу для нового адреса
		this.route(activeHash);

	}

	route(route) {
		//удаляем решётку
		route = route.substr(1);

		if (!localStorage.user) { //!localStorage.user - при пустом попадаем на промо

			//инициируем MVC PROMO
			this.modelOfPromo = new PromoModel();
			this.viewOfPromo = new PromoView(this.modelOfPromo);
			this.controllerOfPromo = new PromoController(this.modelOfPromo);

			this.viewOfPopup = new PopupView(this.modelOfPromo);
			this.controllerOfPopup = new PopupController(this.modelOfPromo);

			this.modelOfPromo.changes
				.sub('changeUser', this.setUser.bind(this));

		} else {

			if (route === 'dashboard') {
				//инициируем MVC DASHBOARD
				this.modelOfList = new DashboardModel(this.user);
				this.viewOfList = new DashboardView(this.modelOfList);
				this.controllerOfList = new DashboardController(this.modelOfList);

				this.modelOfList.changes
					.sub('logOut', this.logOutUser.bind(this));
			} else {
				//надо проверить существует ли такой проект

				//отписываем предыдущие представления от изменений модели
				if (this.viewOfOutput) {
					this.viewOfOutput.unsubscribe();
				}

				//инициируем общую модель проекта
				this.modelOfProject = new ProjectModel(route, this.user);

				//инициируем пользовательский MVC проекта (левый)
				this.viewOfuser = new UserWinView(this.modelOfProject);
				this.controllerOfUser = new UserWinController(this.modelOfProject);

				//инициируем MVCвывода данных проекта (правый)
				this.viewOfOutput = new OutputView(this.modelOfProject);
				this.controllerOfOutput = new OutputController(this.modelOfProject);

				this.modelOfProject.changes
					.sub('logOut', this.logOutUser.bind(this));
			}


		}

	}

	navigateTo(route) {
		// Выполнить начальную навигацию на адрес по умолчанию
		if (document.location.hash === route) {
			this.route(route);
		} else {
			document.location.hash = route;
		}
	}

	setUser(activeUser) {
		this.user = activeUser;
		this.navigateTo('#dashboard');
	}

	logOutUser() {
		this.user = null;
		this.navigateTo('#promo');
	}
}