angular.module('css.services', [])

.factory('BasicMgr', function($http, $q, $timeout) {

    var uniqueKey = "basic_mgr";

    function validate(unitId, reviewDate, reviewType) {
        console.log(unitId, reviewDate, reviewType);

        if (!unitId || !reviewDate || !reviewType) return false;
        if (!/\d{4}-\d{2}/.test(reviewDate) || !/(1|2)/.test(reviewType)) return false;

        return true;
    }

    return {
        createReview: function(unitId, reviewDate, reviewType) {
            var deferred = $q.defer();

            if (!validate(unitId, reviewDate, reviewType)) {
                $timeout(function() {
                    deferred.reject("arguments error");
                }, 0);

                return deferred.promise;
            }

            var reviewId = [uniqueKey, unitId, reviewDate, reviewType].join("_");

            $http.get('data/review_table_3.json').success(function(data) {
                angular.extend(data, {
                    under_review_unit_id: unitId,
                    review_date: reviewDate,
                    review_type: reviewType
                });

                deferred.resolve(data);
            });

            return deferred.promise;
        },

        getReview: function(unitId, reviewDate, reviewType) {
            var deferred = $q.defer();

            if (!validate(unitId, reviewDate, reviewType)) {
                $timeout(function() {
                    deferred.reject("arguments error");
                }, 0);

                return deferred.promise;
            }

            var reviewId = [uniqueKey, unitId, reviewDate, reviewType].join("_");

            var data = localStorage.getItem(reviewId);
            if (data) {
                try {
                    data = JSON.parse(data);
                } catch(ex) {
                    this.createReview(unitId, reviewDate, reviewType).then(function(data) {
                        localStorage.setItem(reviewId, JSON.stringify(data));
                        deferred.resolve(data);
                    });
                }

                deferred.resolve(data);
            } else {
                this.createReview(unitId, reviewDate, reviewType).then(function(data) {
                    localStorage.setItem(reviewId, JSON.stringify(data));
                    deferred.resolve(data);
                });
            }

            return deferred.promise;
        },

        setReview: function(unitId, reviewDate, reviewType, reviewData) {
            var deferred = $q.defer();

            if (!validate(unitId, reviewDate, reviewType)) {
                $timeout(function() {
                    deferred.reject("arguments error");
                }, 0);

                return deferred.promise;
            }
            var reviewId = [uniqueKey, unitId, reviewDate, reviewType].join("_");

            angular.forEach(reviewData.items, function(level1) {
                var status2 = 0;
                angular.forEach(level1.items, function(level2) {
                    var status3 = 0;
                    angular.forEach(level2.items, function(level3) {
                        status3 += level3.status;
                    });

                    if (status3 === level2.items.length) {
                        level2.status = 1;
                    } else {
                        level2.status = 0;
                    }

                    status2 += level2.status;
                });

                if (status2 === level1.items.length) {
                    level1.status = 1;
                } else {
                    level1.status = 0;
                }
            });

            localStorage.setItem(reviewId, JSON.stringify(data));

            $timeout(function() {
                deferred.resolve();
            });

            return deferred.promise;
        },

        getScore: function(unitId, reviewDate, reviewType) {
            var deferred = $q.defer();

            if (!validate(unitId, reviewDate, reviewType)) {
                $timeout(function() {
                    deferred.reject("arguments error");
                }, 0);

                return deferred.promise;
            }
            var reviewId = [uniqueKey, unitId, reviewDate, reviewType].join("_");

            var data = localStorage.getItem(reviewId);
            var score = 0,
                total = 0;
            if (data) {
                try {
                    data = JSON.parse(data);
                } catch(ex) {
                    $timeout(function() {
                        deferred.reject("data parse error");
                    }, 0);

                    return deferred.promise;
                }

                angular.forEach(data.items, function(level1) {
                    angular.forEach(level1.items, function(level2) {
                        angular.forEach(level2.items, function(level3) {
                            if (level3.status) {
                                total += level2.total;
                                score += level3.score;
                            }
                        });
                    });
                });
            }

            $timeout(function() {
                deferred.resolve({
                    total: total,
                    score: score,
                    final: total === 0 ? 0 : Math.floor((total - score) / total * 10000) / 100
                });
            }, 0);

            return deferred.promise;
        },

        getRect: function(unitId, reviewDate, reviewType) {
            var deferred = $q.defer();

            if (!validate(unitId, reviewDate, reviewType)) {
                $timeout(function() {
                    deferred.reject("arguments error");
                }, 0);

                return deferred.promise;
            }

            var reviewId = [uniqueKey, unitId, reviewDate, reviewType].join("_");

            var data = localStorage.getItem(reviewId);
            var ret = [];
            if (data) {
                try {
                    data = JSON.parse(data);
                } catch(ex) {
                    $timeout(function() {
                        deferred.reject("data parse error");
                    }, 0);

                    return deferred.promise;
                }

                angular.forEach(data.items, function(level1) {
                    angular.forEach(level1.items, function(level2) {
                        angular.forEach(level2.items, function(level3) {
                            if (level3.status && level3.score > 0) {
                                ret.push({
                                    name: level3.name,
                                    images: level3.images
                                });
                            }
                        });
                    });
                });
            }

            $timeout(function() {
                deferred.resolve(ret);
            }, 0);

            return deferred.promise;
        }
    };
});