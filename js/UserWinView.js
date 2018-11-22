'use strict';

//представление окон ввода данных уровня ПРОЕКТ (левая часть)
export class UserWinView {
	constructor(model) {
		this.myModel = model;
		//подписываемся на изменения
		this.myModel.changes
			.sub('changeOnload', this.updateWin.bind(this));

		this.myModel.changes
			.sub('changeByDblclick', this.setEditable.bind(this));
		this.myModel.changes
			.sub('changeByBlur', this.removeEditable.bind(this));
		this.myModel.changes
			.sub('changeByKeydown', this.removeEditableByKeydown.bind(this));

	}

	updateWin(data) {
		//отрисовываем полученные с сервера данные
		ace.edit("HTML").setValue(data.html);
		ace.edit("CSS").setValue(data.css);
		ace.edit("JS").setValue(data.js);
		$('.header__title__projectname').text(data.title);
		$('#AUTO-UPDATE').prop('checked', data.autoUpdate);

		//показываем или прячем кнопку автообновления
		if (data.autoUpdate) {
			$('#RUN-BUTTON').hide(0);
		} else {
			$('#RUN-BUTTON').show(0);
		}
	}

	setEditable() {
		// двойной клик открывает редактирование
		$('.header__title__projectname')
			.attr("contentEditable", "true")
			.focus();
	}
	removeEditable() {
		// потеря фокуса закрывает редактирование
		$('.header__title__projectname')
			.attr("contentEditable", "false");
		$('body').focus();
	}
	removeEditableByKeydown(e) {
		// "Escape"	и "Enter" закрывают редактирование
		if (e.key == "Escape" || e.key == "Enter") {
			e.preventDefault();
			this.removeEditable();
		}
	}

}