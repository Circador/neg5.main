(() => {
   
   angular.module('tournamentApp')
        .factory('Phase', ['$http', '$q', 'Cookies', function($http, $q, Cookies) {
            
            let service = this;
            
            let phases = [];
            
            service.phaseFactory = {
                phases,
                postPhase,
                editPhase,
                getPhases,
                deletePhase
            }
            
            function postPhase(tournamentId, phaseName) {
                return $q((resolve, reject) => {
                    let body = {
                        token: Cookies.get('nfToken'),
                        name: phaseName
                    }
                    $http.post('/api/t/' + tournamentId + '/phases', body)
                        .then(({data}) => {
                            addNewPhaseToArray(data.result);
                            resolve(data.result.name);
                        })
                        .catch(error => reject(error));
                })
            }

            function editPhase(tournamentId, newName, phaseId) {
                return $q((resolve, reject) => {
                    let body = {
                        token: Cookies.get('nfToken'),
                        newName
                    }
                    $http.put('/api/t/' + tournamentId + '/phases/' + phaseId, body)
                        .then(({data}) => {
                            updatePhaseInArray(data.result.id, data.result.name)
                            resolve(data.result.name);
                        })
                        .catch(error => reject(error));
                })
            }
            
            function getPhases(tournamentId) {
                return $q((resolve, reject) => {
                    let token = Cookies.get('nfToken');
                    $http.get('/api/t/' + tournamentId + '/phases?token=' + token)
                        .then(({data}) => {
                            let formattedPhases = data.result.map(({name, id}) => {
                                return {
                                    name,
                                    newName: name,
                                    id
                                }
                            });
                            angular.copy(formattedPhases, service.phaseFactory.phases);
                            resolve(formattedPhases);
                        })
                        .catch(error => reject(error));
                })
                
            }
            
            function deletePhase(tournamentId, id) {
                return $q((resolve, reject) => {
                    let token = Cookies.get('nfToken');
                    $http.delete('/api/t/' + tournamentId + '/phases/' + id + '?token=' + token)
                        .then(({data}) => {
                            removePhaseFromArray(data.result.id);
                            resolve(data.result.name);
                        })
                        .catch(error => reject(error));
                })
            }

            function updatePhaseInArray(id, newName) {
                let index = service.phaseFactory.phases.findIndex(phase => phase.id === id);
                if (index !== -1) {
                    service.phaseFactory.phases[index].name = newName;
                }
            }

            function addNewPhaseToArray({name, id}) {
                service.phaseFactory.phases.push({
                    name,
                    id,
                    newName: name
                })
            }

            function removePhaseFromArray(id) {
                let index = service.phaseFactory.phases.findIndex(phase => phase.id === id);
                service.phaseFactory.phases.splice(index, 1);
            }
            
            return service.phaseFactory;
            
        }]); 
        
})();