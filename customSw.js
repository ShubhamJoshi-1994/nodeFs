const staticCacheName = "cache_version-36-app_version-1", 

addEventListener("message", (event) => {
  console.log(`The client sent me a message`, event);
  event.waitUntil(
    checkIfMigrationRequired()
      .then((response) => {
        if (response.status === "migration-required") {
          event.source.postMessage(response);
        }
      })
      .catch((err) => {
        console.log("err", err);
      })
  );

  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          console.log("staticCacheName", staticCacheName);
          if (!key.startsWith(staticCacheName)) {
            console.log("deleting cache");
            return caches.delete(key);
          } else {
            console.log("key name", key);
          }
        })
      );
    })
  );
});

function checkIfMigrationRequired() {
  console.log("migrate function called from install");
  return new Promise(async (resolve, reject) => {
    try {
      // do the version comparison
      const cacheNames = await caches.keys();
      const versionCaches = cacheNames.filter((cacheNames) =>
        cacheNames.startsWith(`version-`)
      );

      let oldVersionNumbers = [];
      if (versionCaches.length) {
        versionCaches.map((version) => {
          oldVersionNumbers.push(parseInt(version.split("-")[1]));
        });
      }
      let newVersionNumber = JSON.parse(staticCacheName.split("-")[1]);

      if (oldVersionNumbers.length) {
        oldVersionNumbers = oldVersionNumbers.sort();
        console.log("versions", oldVersionNumbers[0], newVersionNumber);

        if (oldVersionNumbers[0] < newVersionNumber) {
          console.log("version update available");
          resolve({
            status: "migration-required",
            old_version: oldVersionNumbers[0],
            new_version: newVersionNumber,
          });
        } else {
          // do nothing and update to new version
          console.log("dont run migrations");
          resolve("migration-not-required");
        }
      } else {
        resolve("migration-not-required");
      }
    } catch (error) {
      reject("failed");
    }
  });
}
