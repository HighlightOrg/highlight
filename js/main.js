var highlight = {
	// Getting the required elements
	// Re-initialized once the DOM is loaded (to avoid issues with virtual DOM)
	pageWrapper: document.getElementsByClassName("page-wrapper")[0],
	stickyAlerts: document.getElementsByClassName("sticky-alerts")[0],

	darkModeOn: false, // Also re-initialized once the DOM is loaded (see below)

	// Create cookie
	createCookie: function (name, value, days) {
		var expires;
		if (days) {
			var date = new Date();
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			expires = "; expires=" + date.toGMTString();
		}
		else {
			expires = "";
		}
		document.cookie = name + "=" + value + expires + "; path=/";
	},

	// Read cookie
	readCookie: function (name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(";");
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) === " ") {
				c = c.substring(1, c.length);
			}
			if (c.indexOf(nameEQ) === 0) {
				return c.substring(nameEQ.length, c.length);
			}
		}
		return null;
	},

	// Erase cookie
	eraseCookie: function (name) {
		this.createCookie(name, "", -1);
	},

	// Toggle light/dark mode 
	toggleDarkMode: function () {
		if (document.body.classList.contains("dark-mode")) {
			document.body.classList.remove("dark-mode");
			this.darkModeOn = false;
			this.createCookie("highlight_preferredMode", "light-mode", 365);
		} else {
			document.body.classList.add("dark-mode");
			this.darkModeOn = true;
			this.createCookie("highlight_preferredMode", "dark-mode", 365);
		}
	},

	// Get preferred mode
	getPreferredMode: function () {
		if (this.readCookie("highlight_preferredMode")) {
			return this.readCookie("highlight_preferredMode");
		} else {
			return "not-set";
		}
	},

	// Toggles sidebar
	toggleSidebar: function () {
		if (this.pageWrapper) {
			if (this.pageWrapper.getAttribute("data-sidebar-hidden")) {
				this.pageWrapper.removeAttribute("data-sidebar-hidden");
			} else {
				this.pageWrapper.setAttribute("data-sidebar-hidden", "hidden");
			}
		}
	},

	// Deactivate all the dropdown toggles when another one is active
	deactivateAllDropdownToggles: function () {
		var activeDropdownToggles = document.querySelectorAll("[data-toggle='dropdown'].active");
		for (var i = 0; i < activeDropdownToggles.length; i++) {
			activeDropdownToggles[i].classList.remove("active");
			activeDropdownToggles[i].closest(".dropdown").classList.remove("show");
		}
	},

	// Toggle modal (using Javascript)
	toggleModal: function (modalId) {
		var modal = document.getElementById(modalId);

		if (modal) {
			modal.classList.toggle("show");
		}
	},

	/* Code block for handling sticky alerts */

	// Make an ID for an element
	makeId: function (length) {
		var result = "";
		var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		var charactersLength = characters.length;
		for (var i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	},

	// Toast an alert (show, fade, dispose)
	toastAlert: function (alertId, timeShown) {
		var alertElement = document.getElementById(alertId);

		// Setting the default timeShown
		if (timeShown === undefined) {
			timeShown = 5000;
		}

		// Alert is only toasted if it does not have the .show class
		if (!alertElement.classList.contains("show")) {
			// Add .alert-block class if it does not exist
			if (!alertElement.classList.contains("alert-block")) {
				alertElement.classList.add("alert-block");
			}

			// Show the alert
			// The 0.25 seconds delay is for the animation
			setTimeout(function () {
				alertElement.classList.add("show");
			}, 250);

			// Wait some time (timeShown + 250) and fade out the alert
			var timeToFade = timeShown + 250;
			setTimeout(function () {
				alertElement.classList.add("fade");
			}, timeToFade);

			// Wait some more time (timeToFade + 500) and dispose the alert (by removing the .alert-block class)
			// Again, the extra delay is for the animation
			// Remove the .show and .fade classes (so the alert can be toasted again)
			var timeToDestroy = timeToFade + 500;
			setTimeout(function () {
				alertElement.classList.remove("alert-block");
				alertElement.classList.remove("show");
				alertElement.classList.remove("fade");
			}, timeToDestroy);
		}
	},

	// Create a sticky alert, display it, and then remove it
	initStickyAlert: function (param) {
		// Setting the variables from the param
		var content = ("content" in param) ? param.content : "";
		var title = ("title" in param) ? param.title : "";
		var alertType = ("alertType" in param) ? param.alertType : "";
		var fillType = ("fillType" in param) ? param.fillType : "";
		var hasDismissButton = ("hasDismissButton" in param) ? param.hasDismissButton : true;
		var timeShown = ("timeShown" in param) ? param.timeShown : 5000;

		// Create the alert element
		var alertElement = document.createElement("div");

		// Set ID to the alert element
		alertElement.setAttribute("id", this.makeId(6));

		// Add the title
		if (title) {
			content = "<h4 class='alert-heading'>" + title + "</h4>" + content;
		}

		// Add the classes to the alert element
		alertElement.classList.add("alert");
		if (alertType) {
			alertElement.classList.add(alertType);
		}
		if (fillType) {
			alertElement.classList.add(fillType);
		}

		// Add the close button to the content (if required)
		if (hasDismissButton) {
			content = "<button class='close' data-dismiss='alert' type='button' aria-label='Close'><span aria-hidden='true'>&times;</span></button>" + content;
		}

		// Add the content to the alert element
		alertElement.innerHTML = content;

		// Append the alert element to the sticky alerts
		this.stickyAlerts.insertBefore(alertElement, this.stickyAlerts.childNodes[0]);

		// Toast the alert
		this.toastAlert(alertElement.getAttribute("id"), timeShown);
	},

	/* End code block for handling sticky alerts */

	// Click handler that can be overridden by users if needed
	clickHandler: function (event) { },

	// Keydown handler that can be overridden by users if needed
	keydownHandler: function (event) { },
}


/* Things done once the DOM is loaded */

function highlightOnDOMContentLoaded() {
	// Re-initializing the required elements (to avoid issues with virtual DOM)
	if (!highlight.pageWrapper) {
		highlight.pageWrapper = document.getElementsByClassName("page-wrapper")[0];
	}
	if (!highlight.stickyAlerts) {
		highlight.stickyAlerts = document.getElementsByClassName("sticky-alerts")[0];
	}

	// Handle the cookie and variable for dark mode
	// 1. First preference is given to the cookie if it exists
	if (highlight.readCookie("highlight_preferredMode")) {
		if (highlight.readCookie("highlight_preferredMode") == "dark-mode") {
			highlight.darkModeOn = true;
		} else {
			highlight.darkModeOn = false;
		}
	} else {
		// 2. If cookie does not exist, next preference is for the dark mode setting
		if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
			highlight.darkModeOn = true;
		} else {
			// 3. If all else fails, re-initialize the dark mode preference depending on the .dark-mode class
			if (document.body.classList.contains("dark-mode")) {
				highlight.darkModeOn = true;
			} else {
				highlight.darkModeOn = false;
			}
		}
	}

	// Automatically set preferred theme
	// But only if one of the data-attribute is provided
	if (document.body.getAttribute("data-set-preferred-mode-onload") || document.body.getAttribute("data-set-preferred-theme-onload")) {
		if (highlight.darkModeOn) {
			if (!document.body.classList.contains("dark-mode")) {
				document.body.classList.add("dark-mode");
			}
		} else {
			if (document.body.classList.contains("dark-mode")) {
				document.body.classList.remove("dark-mode");
			}
		}
	}

	// Hiding sidebar on first load on small screens (unless data-attribute provided)
	// Or on larger screens when sidebar type is overlayed-all
	if (document.documentElement.clientWidth <= 768) {
		if (highlight.pageWrapper) {
			if (!highlight.pageWrapper.getAttribute("data-show-sidebar-onload-sm-and-down")) {
				highlight.pageWrapper.setAttribute("data-sidebar-hidden", "hidden");
			}
		}
	} else {
		if (highlight.pageWrapper) {
			if (highlight.pageWrapper.getAttribute("data-sidebar-type") === "overlayed-all") {
				highlight.pageWrapper.setAttribute("data-sidebar-hidden", "hidden");
			}
		}
	}

	// Adding the click event listener
	document.addEventListener(
		"click",
		function (event) {
			var eventCopy = event;
			var target = event.target;

			// Handle clicks on dropdown toggles
			if (target.matches("[data-toggle='dropdown']") || target.matches("[data-toggle='dropdown'] *")) {
				if (target.matches("[data-toggle='dropdown'] *")) {
					target = target.closest("[data-toggle='dropdown']");
				}
				if (target.classList.contains("active")) {
					target.classList.remove("active");
					target.closest(".dropdown").classList.remove("show");
				} else {
					highlight.deactivateAllDropdownToggles();
					target.classList.add("active");
					target.closest(".dropdown").classList.add("show");
				}
			} else {
				if (!target.matches(".dropdown-menu *")) {
					highlight.deactivateAllDropdownToggles();
				}
			}

			// Handle clicks on alert dismiss buttons
			if (target.matches(".alert [data-dismiss='alert']") || target.matches(".alert [data-dismiss='alert'] *")) {
				if (target.matches(".alert [data-dismiss='alert'] *")) {
					target = target.closest(".alert [data-dismiss='alert']");
				}
				target.parentNode.classList.add("dispose");
			}

			// Handle clicks on modal toggles
			if (target.matches("[data-toggle='modal']") || target.matches("[data-toggle='modal'] *")) {
				if (target.matches("[data-toggle='modal'] *")) {
					target = target.closest("[data-toggle='modal']");
				}
				var targetModal = document.getElementById(target.getAttribute("data-target"));
				if (targetModal) {
					if (targetModal.classList.contains("modal")) {
						highlight.toggleModal(target.getAttribute("data-target"));
					}
				}
			}

			// Handle clicks on modal dismiss buttons
			if (target.matches(".modal [data-dismiss='modal']") || target.matches(".modal [data-dismiss='modal'] *")) {
				if (target.matches(".modal [data-dismiss='modal'] *")) {
					target = target.closest(".modal [data-dismiss='modal']");
				}
				target.closest(".modal").classList.remove("show");
			}

			// Handle clicks on modal overlays
			if (target.matches(".modal-dialog")) {
				var parentModal = target.closest(".modal");

				if (!parentModal.getAttribute("data-overlay-dismissal-disabled")) {
					if (parentModal.classList.contains("show")) {
						parentModal.classList.remove("show");
					} else {
						window.location.hash = "#";
					}
				}
			}

			// Call the click handler method to handle any logic set by the user in their projects to handle clicks
			highlight.clickHandler(eventCopy);
		},
		false
	);

	// Adding the key down event listener (for shortcuts and accessibility)
	document.addEventListener(
		"keydown",
		function (event) {
			var eventCopy = event;

			// Shortcuts are triggered only if no input, textarea, or select has focus,
			// If the control key or command key is not pressed down,
			// And if the enabling data attribute is present on the DOM's body
			if (!(document.querySelector("input:focus") || document.querySelector("textarea:focus") || document.querySelector("select:focus"))) {
				event = event || window.event;

				if (!(event.ctrlKey || event.metaKey)) {
					// Toggle sidebar when [shift] + [S] keys are pressed
					if (document.body.getAttribute("data-sidebar-shortcut-enabled")) {
						if (event.shiftKey && event.which == 83) {
							// Variable to store whether a modal is open or not
							var modalOpen = false;

							// Hash exists, so we check if it belongs to a modal
							if (window.location.hash) {
								var hash = window.location.hash.substring(1);
								var elem = document.getElementById(hash);
								if (elem) {
									if (elem.classList.contains("modal")) {
										modalOpen = true;
									}
								}
							}
							// Check for a modal with the .show class
							if (document.querySelector(".modal.show")) {
								modalOpen = true;
							}

							// This shortcut works only if no modal is open
							if (!modalOpen) {
								highlight.toggleSidebar();
								event.preventDefault();
							}
						}
					}

					// Toggle dark mode when [shift] + [D] keys are pressed
					if (document.body.getAttribute("data-dm-shortcut-enabled")) {
						if (event.shiftKey && event.which == 68) {
							highlight.toggleDarkMode();
							event.preventDefault();
						}
					}
				}
			}

			// Handling other keydown events
			if (event.which === 27) {
				// Close dropdown menu (if one is open) when [esc] key is pressed
				if (document.querySelector("[data-toggle='dropdown'].active")) {
					var elem = document.querySelector("[data-toggle='dropdown'].active");
					elem.classList.remove("active");
					elem.closest(".dropdown").classList.remove("show");
					event.preventDefault();
				}
				// Close modal (if one is open, and if no dropdown menu is open) when [esc] key is pressed
				// Conditional on dropdowns so that dropdowns on modals can be closed with the keyboard without closing the modal
				else {
					// Hash exists, so we check if it belongs to a modal
					if (window.location.hash) {
						var hash = window.location.hash.substring(1);
						var elem = document.getElementById(hash);
						if (elem) {
							if (elem.classList.contains("modal")) {
								if (!elem.getAttribute("data-esc-dismissal-disabled")) {
									window.location.hash = "#";
									event.preventDefault();
								}
							}
						}
					}
					// Check for a modal with the .show class
					if (document.querySelector(".modal.show")) {
						var elem = document.querySelector(".modal.show");
						if (!elem.getAttribute("data-esc-dismissal-disabled")) {
							elem.classList.remove("show");
							event.preventDefault();
						}
					}
				}
			}

			// Call the keydown handler method to handle any logic set by the user in their projects to handle keydown events
			highlight.keydownHandler(eventCopy);
		}
	);

	// Adding the .with-transitions class to the page-wrapper so that transitions are enabled
	// This way, the weird bug on Chrome is avoided, where the transitions run on load
	if (highlight.pageWrapper) {
		highlight.pageWrapper.classList.add("with-transitions");
	}
}


// Call the function when the DOM is loaded
document.addEventListener("DOMContentLoaded", highlightOnDOMContentLoaded);