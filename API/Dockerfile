FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /app
EXPOSE 8080

# pull dependencies
COPY *.csproj ./
RUN dotnet restore

# copy all and build with config=Release into /out
COPY . ./
RUN dotnet publish -c Release -o out

# run build with aspnet - smaller than sdk
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build-env /app/out .
ENTRYPOINT ["dotnet", "API.dll"]