/* global window */
export default class HomeController {
  constructor($scope, $timeout, $cookies, TournamentService) {
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.$cookies = $cookies;
    this.TournamentService = TournamentService;

    this.tournaments = [];
    this.submittingForm = false;
    this.newTournament = {};

    this.toastPromise = null;

    this.$scope.toastMessage = null;
    this.$scope.logout = () => {
      this.$cookies.remove('nfToken');
      window.location = '/';
    };
    this.$scope.toast = this.toast.bind(this);

    this.getTournaments();
  }

  getTournaments() {
    const jwt = this.$cookies.get('nfToken');
    this.TournamentService.getUserTournaments(jwt)
      .then((tournaments) => {
        this.tournaments = tournaments;
      })
      .catch(error => console.log(error));
  }

  createNewTournament() {
    const { $valid } = this.newTournamentForm;
    if ($valid) {
      const toastConfig = {
        message: `Adding tournament: ${this.newTournament.name}.`,
      };
      this.$scope.toast(toastConfig);
      this.submittingForm = true;
      const token = this.$cookies.get('nfToken');
      const name = this.newTournament.name;
      this.TournamentService.newTournament(name, token)
        .then(({ name: tournamentName }) => {
          this.getTournaments();
          this.newTournament = {};
          toastConfig.success = true;
          toastConfig.message = `Added tournament: ${tournamentName}`;
        })
        .catch(() => {
          toastConfig.success = false;
          toastConfig.message = 'Could not add tournament.';
        })
        .finally(() => {
          toastConfig.hideAfter = true;
          this.submittingForm = false;
          this.$scope.toast(toastConfig);
        });
    }
  }

  toast({ message, success = null, hideAfter }) {
    if (hideAfter) {
      if (this.toastPromise) {
        this.$timeout.cancel(this.toastPromise);
      }
      this.toastPromise = this.$timeout(() => {
        this.$scope.toastMessage = null;
        this.toastPromise = null;
      }, 3000);
    }
    this.$scope.toastMessage = {
      message,
      success,
    };
  }
}

HomeController.$inject = ['$scope', '$timeout', '$cookies', 'TournamentService'];